<?php
declare(strict_types=1);

const DATA_DIR = __DIR__ . '/../.tracking-admin';
const CREDENTIALS_FILE = DATA_DIR . '/credentials.json';
const TRACKING_FILE = DATA_DIR . '/tracking.json';

$isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/admin',
    'secure' => $isHttps,
    'httponly' => true,
    'samesite' => 'Strict',
]);
session_start();

header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

function escape(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function readJson(string $path, array $fallback = []): array
{
    if (!is_readable($path)) {
        return $fallback;
    }

    $decoded = json_decode((string) file_get_contents($path), true);
    return is_array($decoded) ? $decoded : $fallback;
}

function ensureDataDirectory(): bool
{
    if (!is_dir(DATA_DIR) && !(mkdir(DATA_DIR, 0700, true) || is_dir(DATA_DIR))) {
        return false;
    }

    $protectionFile = DATA_DIR . '/.htaccess';
    if (!is_file($protectionFile)) {
        @file_put_contents(
            $protectionFile,
            "Require all denied\nDeny from all\nOptions -Indexes\n",
            LOCK_EX
        );
        @chmod($protectionFile, 0600);
    }

    return true;
}

function writeJson(string $path, array $data): bool
{
    if (!ensureDataDirectory()) {
        return false;
    }

    $temporary = $path . '.tmp-' . bin2hex(random_bytes(6));
    $encoded = json_encode(
        $data,
        JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE
    );

    if ($encoded === false || file_put_contents($temporary, $encoded, LOCK_EX) === false) {
        return false;
    }

    @chmod($temporary, 0600);
    if (!rename($temporary, $path)) {
        @unlink($temporary);
        return false;
    }

    @chmod($path, 0600);
    return true;
}

function redirectToPanel(): void
{
    header('Location: /admin/');
    exit;
}

function validCsrfToken(string $token): bool
{
    return isset($_SESSION['csrf'])
        && is_string($_SESSION['csrf'])
        && hash_equals($_SESSION['csrf'], $token);
}

function validTrackingValue(string $value, string $pattern): bool
{
    return $value === '' || preg_match($pattern, $value) === 1;
}

if (!isset($_SESSION['csrf'])) {
    $_SESSION['csrf'] = bin2hex(random_bytes(24));
}

$defaultConfig = [
    'mode' => 'direct',
    'gtmId' => '',
    'ga4MeasurementId' => '',
    'googleAdsId' => '',
    'googleAdsConversionLabel' => '',
    'metaPixelId' => '',
    'updatedAt' => null,
];

$credentials = readJson(CREDENTIALS_FILE);
$isConfigured = isset($credentials['passwordHash'])
    && is_string($credentials['passwordHash'])
    && $credentials['passwordHash'] !== '';
$isAuthenticated = !empty($_SESSION['tracking_admin_authenticated']);
$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $csrfToken = (string) ($_POST['csrf'] ?? '');
    if (!validCsrfToken($csrfToken)) {
        $error = 'Sua sessão expirou. Atualize a página e tente novamente.';
    } else {
        $action = (string) ($_POST['action'] ?? '');

        if ($action === 'setup' && !$isConfigured) {
            $password = (string) ($_POST['password'] ?? '');
            $confirmation = (string) ($_POST['password_confirmation'] ?? '');

            if (strlen($password) < 12) {
                $error = 'A senha precisa ter pelo menos 12 caracteres.';
            } elseif ($password !== $confirmation) {
                $error = 'As senhas informadas não são iguais.';
            } elseif (!writeJson(CREDENTIALS_FILE, [
                'passwordHash' => password_hash($password, PASSWORD_DEFAULT),
                'createdAt' => gmdate('c'),
            ])) {
                $error = 'Não foi possível criar a configuração protegida no servidor.';
            } else {
                session_regenerate_id(true);
                $_SESSION['tracking_admin_authenticated'] = true;
                $_SESSION['csrf'] = bin2hex(random_bytes(24));
                redirectToPanel();
            }
        }

        if ($action === 'login' && $isConfigured) {
            $blockedUntil = (int) ($_SESSION['login_blocked_until'] ?? 0);
            $password = (string) ($_POST['password'] ?? '');

            if ($blockedUntil > time()) {
                $error = 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
            } elseif (password_verify($password, (string) $credentials['passwordHash'])) {
                session_regenerate_id(true);
                $_SESSION['tracking_admin_authenticated'] = true;
                $_SESSION['login_attempts'] = 0;
                $_SESSION['csrf'] = bin2hex(random_bytes(24));
                redirectToPanel();
            } else {
                $attempts = (int) ($_SESSION['login_attempts'] ?? 0) + 1;
                $_SESSION['login_attempts'] = $attempts;
                if ($attempts >= 5) {
                    $_SESSION['login_blocked_until'] = time() + 600;
                }
                $error = 'Senha incorreta.';
            }
        }

        if ($action === 'logout') {
            $_SESSION = [];
            session_destroy();
            redirectToPanel();
        }

        if ($action === 'save' && $isAuthenticated) {
            $mode = ($_POST['mode'] ?? 'direct') === 'gtm' ? 'gtm' : 'direct';
            $values = [
                'gtmId' => strtoupper(trim((string) ($_POST['gtm_id'] ?? ''))),
                'ga4MeasurementId' => strtoupper(trim((string) ($_POST['ga4_id'] ?? ''))),
                'googleAdsId' => strtoupper(trim((string) ($_POST['google_ads_id'] ?? ''))),
                'googleAdsConversionLabel' => trim((string) ($_POST['google_ads_label'] ?? '')),
                'metaPixelId' => trim((string) ($_POST['meta_pixel_id'] ?? '')),
            ];

            $patterns = [
                'gtmId' => '/^GTM-[A-Z0-9]+$/',
                'ga4MeasurementId' => '/^G-[A-Z0-9]{6,20}$/',
                'googleAdsId' => '/^AW-[0-9]{5,20}$/',
                'googleAdsConversionLabel' => '/^[A-Za-z0-9_-]{3,100}$/',
                'metaPixelId' => '/^[0-9]{5,30}$/',
            ];

            foreach ($patterns as $key => $pattern) {
                if (!validTrackingValue($values[$key], $pattern)) {
                    $error = 'Um dos identificadores informados não possui um formato válido.';
                    break;
                }
            }

            if ($error === '' && $mode === 'gtm' && $values['gtmId'] === '') {
                $error = 'Informe o ID do Google Tag Manager para usar o modo GTM.';
            }

            if ($error === '' && $values['googleAdsConversionLabel'] !== '' && $values['googleAdsId'] === '') {
                $error = 'Informe o ID do Google Ads junto com o rótulo de conversão.';
            }

            if ($error === '') {
                $config = array_merge(
                    ['mode' => $mode],
                    $values,
                    ['updatedAt' => gmdate('c')]
                );

                if (writeJson(TRACKING_FILE, $config)) {
                    $success = 'Configurações salvas. As alterações já estão ativas no site.';
                } else {
                    $error = 'Não foi possível salvar. Verifique as permissões da hospedagem.';
                }
            }

            $newPassword = (string) ($_POST['new_password'] ?? '');
            if ($error === '' && $newPassword !== '') {
                $currentPassword = (string) ($_POST['current_password'] ?? '');
                $confirmation = (string) ($_POST['new_password_confirmation'] ?? '');

                if (!password_verify($currentPassword, (string) $credentials['passwordHash'])) {
                    $error = 'A senha atual não confere.';
                } elseif (strlen($newPassword) < 12) {
                    $error = 'A nova senha precisa ter pelo menos 12 caracteres.';
                } elseif ($newPassword !== $confirmation) {
                    $error = 'A confirmação da nova senha não confere.';
                } elseif (writeJson(CREDENTIALS_FILE, [
                    'passwordHash' => password_hash($newPassword, PASSWORD_DEFAULT),
                    'createdAt' => $credentials['createdAt'] ?? gmdate('c'),
                    'updatedAt' => gmdate('c'),
                ])) {
                    $success = 'Configurações e senha atualizadas com sucesso.';
                } else {
                    $error = 'Não foi possível atualizar a senha.';
                }
            }
        }
    }
}

$config = array_merge($defaultConfig, readJson(TRACKING_FILE));
$csrf = escape((string) $_SESSION['csrf']);
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,nofollow,noarchive">
  <title>Painel de rastreamento | Retífica Três Estrelas</title>
  <style>
    :root{--gold:#d39a2d;--gold-dark:#9e6d19;--ink:#0b0c0d;--panel:#111315;--line:#2b2e31;--muted:#a4a7ab;--danger:#ff8d87;--ok:#7be0ad}
    *{box-sizing:border-box}
    body{margin:0;min-height:100vh;background:radial-gradient(circle at 20% 0,rgba(211,154,45,.14),transparent 30%),#08090a;color:#fff;font-family:Inter,Arial,sans-serif}
    a{color:inherit}
    button,input,select{font:inherit}
    .shell{width:min(100% - 30px,980px);margin:0 auto;padding:34px 0 70px}
    .top{display:flex;align-items:center;justify-content:space-between;gap:18px;margin-bottom:26px}
    .brand{display:flex;align-items:center;gap:14px}
    .brand-mark{display:grid;width:48px;height:48px;place-items:center;border:1px solid rgba(211,154,45,.55);border-radius:14px;background:rgba(211,154,45,.1);color:var(--gold);font-size:22px;font-weight:900}
    h1{margin:0;font-size:clamp(1.35rem,4vw,2rem);line-height:1.15}
    .subtitle{margin:5px 0 0;color:var(--muted);font-size:.86rem}
    .card{border:1px solid var(--line);border-radius:20px;background:rgba(17,19,21,.96);padding:clamp(20px,4vw,34px);box-shadow:0 24px 70px rgba(0,0,0,.3)}
    .auth-card{max-width:520px;margin:9vh auto 0}
    .notice{margin:0 0 20px;border-radius:12px;padding:12px 14px;font-size:.86rem}
    .notice.error{border:1px solid rgba(255,141,135,.35);background:rgba(255,141,135,.08);color:var(--danger)}
    .notice.success{border:1px solid rgba(123,224,173,.32);background:rgba(123,224,173,.08);color:var(--ok)}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}
    .field{display:grid;gap:7px}
    .field.full{grid-column:1/-1}
    label{font-size:.78rem;font-weight:800;color:#e5e6e8}
    input,select{width:100%;height:48px;border:1px solid #36393d;border-radius:10px;background:#0b0c0d;color:#fff;padding:0 13px;outline:none}
    input:focus,select:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(211,154,45,.12)}
    small{color:var(--muted);font-size:.72rem;line-height:1.45}
    .section-title{margin:30px 0 15px;border-top:1px solid var(--line);padding-top:24px;font-size:1rem}
    .mode-help{margin:8px 0 20px;border-left:3px solid var(--gold);background:#0c0d0e;color:var(--muted);padding:11px 13px;font-size:.79rem;line-height:1.55}
    .actions{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:28px}
    .button{display:inline-flex;min-height:46px;align-items:center;justify-content:center;border:1px solid transparent;border-radius:10px;cursor:pointer;padding:11px 18px;font-weight:850}
    .button.primary{background:var(--gold);color:#090a0b}
    .button.ghost{border-color:#3b3e42;background:transparent;color:#fff}
    .logout{margin:0}
    .status{display:flex;gap:8px;align-items:center;color:var(--muted);font-size:.75rem}
    .dot{width:8px;height:8px;border-radius:50%;background:var(--ok);box-shadow:0 0 0 5px rgba(123,224,173,.08)}
    [data-direct],[data-gtm]{transition:opacity .15s ease}
    .hidden-mode{display:none}
    @media(max-width:680px){.shell{width:min(100% - 20px,980px);padding-top:18px}.top{align-items:flex-start}.grid{grid-template-columns:1fr}.field.full{grid-column:auto}.actions{align-items:stretch;flex-direction:column}.actions .button{width:100%}.status{order:2}}
  </style>
</head>
<body>
  <main class="shell">
    <header class="top">
      <div class="brand">
        <span class="brand-mark" aria-hidden="true">3★</span>
        <div>
          <h1>Painel de rastreamento</h1>
          <p class="subtitle">Retífica Três Estrelas</p>
        </div>
      </div>
      <?php if ($isAuthenticated): ?>
        <form class="logout" method="post">
          <input type="hidden" name="csrf" value="<?= $csrf ?>">
          <input type="hidden" name="action" value="logout">
          <button class="button ghost" type="submit">Sair</button>
        </form>
      <?php endif; ?>
    </header>

    <?php if ($error !== ''): ?>
      <div class="notice error" role="alert"><?= escape($error) ?></div>
    <?php endif; ?>
    <?php if ($success !== ''): ?>
      <div class="notice success" role="status"><?= escape($success) ?></div>
    <?php endif; ?>

    <?php if (!$isConfigured): ?>
      <section class="card auth-card">
        <h2>Primeiro acesso</h2>
        <p class="subtitle">Crie a senha que protegerá as configurações de anúncios. Use pelo menos 12 caracteres.</p>
        <form method="post">
          <input type="hidden" name="csrf" value="<?= $csrf ?>">
          <input type="hidden" name="action" value="setup">
          <div class="grid" style="margin-top:22px">
            <div class="field full">
              <label for="password">Nova senha</label>
              <input id="password" name="password" type="password" minlength="12" autocomplete="new-password" required>
            </div>
            <div class="field full">
              <label for="password_confirmation">Confirmar senha</label>
              <input id="password_confirmation" name="password_confirmation" type="password" minlength="12" autocomplete="new-password" required>
            </div>
          </div>
          <div class="actions">
            <small>Essa senha não é enviada para terceiros.</small>
            <button class="button primary" type="submit">Criar acesso seguro</button>
          </div>
        </form>
      </section>
    <?php elseif (!$isAuthenticated): ?>
      <section class="card auth-card">
        <h2>Entrar no painel</h2>
        <p class="subtitle">Informe a senha administrativa criada no primeiro acesso.</p>
        <form method="post">
          <input type="hidden" name="csrf" value="<?= $csrf ?>">
          <input type="hidden" name="action" value="login">
          <div class="field" style="margin-top:22px">
            <label for="login-password">Senha</label>
            <input id="login-password" name="password" type="password" autocomplete="current-password" required>
          </div>
          <div class="actions">
            <small>Após cinco tentativas incorretas, o acesso é pausado por 10 minutos.</small>
            <button class="button primary" type="submit">Entrar</button>
          </div>
        </form>
      </section>
    <?php else: ?>
      <section class="card">
        <form method="post" id="tracking-form">
          <input type="hidden" name="csrf" value="<?= $csrf ?>">
          <input type="hidden" name="action" value="save">

          <div class="field">
            <label for="mode">Forma de instalação</label>
            <select id="mode" name="mode">
              <option value="direct" <?= $config['mode'] === 'direct' ? 'selected' : '' ?>>Tags diretas no site</option>
              <option value="gtm" <?= $config['mode'] === 'gtm' ? 'selected' : '' ?>>Google Tag Manager</option>
            </select>
          </div>

          <p class="mode-help">
            Use <strong>Google Tag Manager</strong> se sua agência gerencia todas as tags dentro do GTM.
            Use <strong>Tags diretas</strong> para configurar Meta Pixel, GA4 e Google Ads neste painel.
          </p>

          <div data-gtm>
            <div class="field">
              <label for="gtm_id">ID do Google Tag Manager</label>
              <input id="gtm_id" name="gtm_id" value="<?= escape((string) $config['gtmId']) ?>" placeholder="GTM-XXXXXXX" autocomplete="off">
              <small>Os eventos de clique no WhatsApp são enviados ao dataLayer como <strong>whatsapp_click</strong>.</small>
            </div>
          </div>

          <div class="grid" data-direct>
            <div class="field">
              <label for="meta_pixel_id">Meta Pixel ID</label>
              <input id="meta_pixel_id" name="meta_pixel_id" value="<?= escape((string) $config['metaPixelId']) ?>" placeholder="123456789012345" inputmode="numeric" autocomplete="off">
              <small>Dispara PageView e o evento personalizado WhatsAppClick.</small>
            </div>
            <div class="field">
              <label for="ga4_id">ID de medição do GA4</label>
              <input id="ga4_id" name="ga4_id" value="<?= escape((string) $config['ga4MeasurementId']) ?>" placeholder="G-XXXXXXXXXX" autocomplete="off">
              <small>Recebe o evento whatsapp_click com a origem do botão.</small>
            </div>
            <div class="field">
              <label for="google_ads_id">ID do Google Ads</label>
              <input id="google_ads_id" name="google_ads_id" value="<?= escape((string) $config['googleAdsId']) ?>" placeholder="AW-123456789" autocomplete="off">
            </div>
            <div class="field">
              <label for="google_ads_label">Rótulo da conversão</label>
              <input id="google_ads_label" name="google_ads_label" value="<?= escape((string) $config['googleAdsConversionLabel']) ?>" placeholder="AbCdEfGhIjKlMn" autocomplete="off">
              <small>Encontre este valor na ação de conversão criada no Google Ads.</small>
            </div>
          </div>

          <h2 class="section-title">Alterar senha <small>(opcional)</small></h2>
          <div class="grid">
            <div class="field">
              <label for="current_password">Senha atual</label>
              <input id="current_password" name="current_password" type="password" autocomplete="current-password">
            </div>
            <div class="field">
              <label for="new_password">Nova senha</label>
              <input id="new_password" name="new_password" type="password" minlength="12" autocomplete="new-password">
            </div>
            <div class="field">
              <label for="new_password_confirmation">Confirmar nova senha</label>
              <input id="new_password_confirmation" name="new_password_confirmation" type="password" minlength="12" autocomplete="new-password">
            </div>
          </div>

          <div class="actions">
            <div class="status">
              <span class="dot" aria-hidden="true"></span>
              <?php if (!empty($config['updatedAt'])): ?>
                Configuração salva no servidor
              <?php else: ?>
                Rastreamento ainda não configurado
              <?php endif; ?>
            </div>
            <button class="button primary" type="submit">Salvar configurações</button>
          </div>
        </form>
      </section>
    <?php endif; ?>
  </main>
  <script>
    (() => {
      const mode = document.getElementById('mode');
      if (!mode) return;
      const refresh = () => {
        document.querySelectorAll('[data-gtm]').forEach((node) => {
          node.classList.toggle('hidden-mode', mode.value !== 'gtm');
        });
        document.querySelectorAll('[data-direct]').forEach((node) => {
          node.classList.toggle('hidden-mode', mode.value !== 'direct');
        });
      };
      mode.addEventListener('change', refresh);
      refresh();
    })();
  </script>
</body>
</html>
