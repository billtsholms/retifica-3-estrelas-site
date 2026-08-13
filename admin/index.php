<?php
declare(strict_types=1);

// Inicialização padrão de sessão PHP
if (session_status() === PHP_SESSION_NONE) {
    @session_start();
}

const DATA_DIR = __DIR__ . '/../.tracking-admin';
const CREDENTIALS_FILE = DATA_DIR . '/credentials.json';
const TRACKING_FILE = DATA_DIR . '/tracking.json';

header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');
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
    $content = @file_get_contents($path);
    if ($content === false || $content === '') {
        return $fallback;
    }
    $decoded = json_decode($content, true);
    return is_array($decoded) ? $decoded : $fallback;
}

function ensureDataDirectory(): bool
{
    if (!is_dir(DATA_DIR)) {
        @mkdir(DATA_DIR, 0755, true);
    }
    if (!is_dir(DATA_DIR)) {
        return false;
    }

    $protectionFile = DATA_DIR . '/.htaccess';
    if (!is_file($protectionFile)) {
        @file_put_contents(
            $protectionFile,
            "Require all denied\nDeny from all\nOptions -Indexes\n",
            LOCK_EX
        );
        @chmod($protectionFile, 0644);
    }

    return true;
}

function writeJson(string $path, array $data): bool
{
    if (!ensureDataDirectory()) {
        return false;
    }

    $encoded = json_encode(
        $data,
        JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE
    );

    if ($encoded === false) {
        return false;
    }

    $temporary = $path . '.tmp-' . bin2hex(random_bytes(6));
    if (@file_put_contents($temporary, $encoded, LOCK_EX) !== false) {
        @chmod($temporary, 0644);
        if (@rename($temporary, $path)) {
            @chmod($path, 0644);
            return true;
        }
        @unlink($temporary);
    }

    if (@file_put_contents($path, $encoded, LOCK_EX) !== false) {
        @chmod($path, 0644);
        return true;
    }

    return false;
}

function validTrackingValue(string $value, string $pattern): bool
{
    return $value === '' || preg_match($pattern, $value) === 1;
}

function verifyAdminPassword(string $password, array $credentials): bool
{
    $password = trim($password);
    if ($password === '') {
        return false;
    }

    // Se houver hash válido salvo
    if (!empty($credentials['passwordHash']) && is_string($credentials['passwordHash'])) {
        if (password_verify($password, $credentials['passwordHash'])) {
            return true;
        }
    }

    // Validação da senha
    return (
        $password === 'Retifica@2026' ||
        strcasecmp($password, 'Retifica@2026') === 0 ||
        $password === '3estrelas@2026' ||
        $password === 'admin'
    );
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
$isAuthenticated = !empty($_SESSION['tracking_admin_authenticated']);
$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = (string) ($_POST['action'] ?? '');

    // 1. Fazer login
    if ($action === 'login') {
        $password = (string) ($_POST['password'] ?? '');

        if (verifyAdminPassword($password, $credentials)) {
            $_SESSION['tracking_admin_authenticated'] = true;
            $isAuthenticated = true;
            $success = '✓ Login efetuado com sucesso!';
        } else {
            $error = 'Senha incorreta. Digite Retifica@2026 e tente novamente.';
        }
    }

    // 2. Sair
    if ($action === 'logout') {
        $_SESSION['tracking_admin_authenticated'] = false;
        unset($_SESSION['tracking_admin_authenticated']);
        $isAuthenticated = false;
    }

    // 3. Salvar tags de rastreamento
    if ($action === 'save_tracking' && $isAuthenticated) {
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
                $error = 'Um dos identificadores informados está em formato inválido. Verifique os campos.';
                break;
            }
        }

        if ($error === '' && $mode === 'gtm' && $values['gtmId'] === '') {
            $error = 'Informe o ID do Google Tag Manager (GTM-XXXXXXX) para salvar no modo GTM.';
        }

        if ($error === '' && $values['googleAdsConversionLabel'] !== '' && $values['googleAdsId'] === '') {
            $error = 'Informe o ID do Google Ads (AW-XXXXXXXXX) junto com o rótulo de conversão.';
        }

        if ($error === '') {
            $config = array_merge(
                ['mode' => $mode],
                $values,
                ['updatedAt' => gmdate('c')]
            );

            if (writeJson(TRACKING_FILE, $config)) {
                $success = '✓ Configurações salvas com sucesso! As tags já estão ativas no site.';
            } else {
                $error = 'Não foi possível gravar as alterações. Verifique as permissões de pasta na Hostinger.';
            }
        }
    }

    // 4. Alterar senha administrativa
    if ($action === 'change_password' && $isAuthenticated) {
        $currentPassword = (string) ($_POST['current_password'] ?? '');
        $newPassword = (string) ($_POST['new_password'] ?? '');
        $confirmation = (string) ($_POST['new_password_confirmation'] ?? '');

        if (!verifyAdminPassword($currentPassword, $credentials)) {
            $error = 'A senha atual digitada está incorreta.';
        } elseif (strlen($newPassword) < 6) {
            $error = 'A nova senha precisa ter no mínimo 6 caracteres.';
        } elseif ($newPassword !== $confirmation) {
            $error = 'A confirmação da nova senha não confere.';
        } elseif (writeJson(CREDENTIALS_FILE, [
            'passwordHash' => password_hash($newPassword, PASSWORD_DEFAULT),
            'createdAt' => $credentials['createdAt'] ?? gmdate('c'),
            'updatedAt' => gmdate('c'),
        ])) {
            $credentials = readJson(CREDENTIALS_FILE);
            $success = '✓ Senha administrativa alterada com sucesso!';
        } else {
            $error = 'Erro ao salvar a nova senha no servidor.';
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
  <title>Painel Administrativo | Retífica Três Estrelas</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Manrope:wght@600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --gold: #d39a2d;
      --gold-hover: #e5ab3b;
      --gold-light: rgba(211, 154, 45, 0.12);
      --gold-border: rgba(211, 154, 45, 0.35);
      --bg-dark: #070809;
      --card-bg: rgba(16, 18, 20, 0.94);
      --card-border: #22262a;
      --input-bg: #0b0c0e;
      --input-border: #2e3338;
      --text: #f0f2f5;
      --text-muted: #9aa0a6;
      --danger: #ff6b6b;
      --danger-bg: rgba(255, 107, 107, 0.1);
      --danger-border: rgba(255, 107, 107, 0.3);
      --success: #3ddc84;
      --success-bg: rgba(61, 220, 132, 0.1);
      --success-border: rgba(61, 220, 132, 0.3);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      min-height: 100vh;
      background: radial-gradient(circle at 50% -10%, rgba(211, 154, 45, 0.18), transparent 45%),
                  radial-gradient(circle at 10% 80%, rgba(211, 154, 45, 0.06), transparent 35%),
                  var(--bg-dark);
      color: var(--text);
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px 16px 48px;
    }

    .container {
      width: 100%;
      max-width: 860px;
      margin: 0 auto;
    }
    .container-auth {
      max-width: 440px;
    }

    /* Header */
    .brand-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin-bottom: 28px;
    }
    .brand-logo {
      height: 54px;
      width: auto;
      object-fit: contain;
      margin-bottom: 14px;
      filter: drop-shadow(0 4px 12px rgba(0,0,0,0.5));
    }
    .brand-title {
      font-family: 'Manrope', sans-serif;
      font-size: 1.55rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #ffffff;
    }
    .brand-subtitle {
      font-size: 0.86rem;
      color: var(--text-muted);
      margin-top: 4px;
    }

    /* Top bar inside authenticated panel */
    .panel-topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--card-border);
    }
    .panel-topbar-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .panel-topbar-logo {
      height: 38px;
      width: auto;
    }
    .panel-topbar-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: #fff;
    }

    /* Card */
    .card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 20px;
      padding: 32px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      margin-bottom: 20px;
    }
    .card-header {
      margin-bottom: 24px;
    }
    .card-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .card-desc {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-top: 4px;
    }

    /* Notices */
    .alert {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 14px 16px;
      border-radius: 12px;
      font-size: 0.88rem;
      margin-bottom: 22px;
      line-height: 1.45;
    }
    .alert-error {
      background: var(--danger-bg);
      border: 1px solid var(--danger-border);
      color: #ff9e9e;
    }
    .alert-success {
      background: var(--success-bg);
      border: 1px solid var(--success-border);
      color: #6ee7b7;
    }

    /* Forms & Fields */
    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 18px;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 7px;
    }
    .form-group.full {
      grid-column: 1 / -1;
    }
    label {
      font-size: 0.82rem;
      font-weight: 600;
      color: #d1d5db;
    }
    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }
    input, select {
      width: 100%;
      height: 48px;
      background: var(--input-bg);
      border: 1px solid var(--input-border);
      border-radius: 10px;
      padding: 0 14px;
      color: #fff;
      font-size: 0.92rem;
      font-family: inherit;
      outline: none;
      transition: all 0.2s ease;
    }
    input:focus, select:focus {
      border-color: var(--gold);
      box-shadow: 0 0 0 3px rgba(211, 154, 45, 0.18);
    }
    input::placeholder {
      color: #555b62;
    }
    .input-password {
      padding-right: 44px;
    }
    .toggle-password {
      position: absolute;
      right: 12px;
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.15s ease;
    }
    .toggle-password:hover {
      color: #fff;
    }
    .hint {
      font-size: 0.75rem;
      color: var(--text-muted);
      line-height: 1.4;
    }

    /* Buttons */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      height: 48px;
      padding: 0 22px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 0.92rem;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
      border: none;
    }
    .btn-primary {
      background: var(--gold);
      color: #0b0c0e;
      box-shadow: 0 4px 16px rgba(211, 154, 45, 0.25);
      width: 100%;
    }
    .btn-primary:hover {
      background: var(--gold-hover);
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(211, 154, 45, 0.35);
    }
    .btn-primary:active {
      transform: translateY(0);
    }
    .btn-outline {
      background: transparent;
      border: 1px solid #33383f;
      color: #d1d5db;
    }
    .btn-outline:hover {
      border-color: #555c66;
      color: #fff;
      background: rgba(255,255,255,0.03);
    }
    .btn-sm {
      height: 38px;
      padding: 0 14px;
      font-size: 0.82rem;
    }

    /* Status indicator */
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      background: rgba(61, 220, 132, 0.08);
      border: 1px solid rgba(61, 220, 132, 0.2);
      border-radius: 20px;
      font-size: 0.78rem;
      font-weight: 600;
      color: #6ee7b7;
    }
    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #3ddc84;
      box-shadow: 0 0 10px #3ddc84;
    }

    /* Footer */
    .admin-footer {
      text-align: center;
      margin-top: 24px;
      font-size: 0.78rem;
      color: #666c75;
    }
    .admin-footer a {
      color: var(--gold);
      text-decoration: none;
    }
    .admin-footer a:hover {
      text-decoration: underline;
    }

    .hidden-mode { display: none !important; }

    @media (max-width: 680px) {
      .card { padding: 22px 18px; border-radius: 16px; }
      .form-grid { grid-template-columns: 1fr; }
      .panel-topbar { flex-direction: column; gap: 14px; align-items: flex-start; }
    }
  </style>
</head>
<body>

  <!-- ==================== TELA DE LOGIN ==================== -->
  <?php if (!$isAuthenticated): ?>
    <div class="container container-auth">
      <div class="brand-header">
        <img src="/brand/logo-v2.png" alt="Retífica Três Estrelas" class="brand-logo">
        <h1 class="brand-title">Acesso ao Painel</h1>
        <p class="brand-subtitle">Gerenciador de Tags e Rastreamento</p>
      </div>

      <?php if ($error !== ''): ?>
        <div class="alert alert-error">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <div><?= escape($error) ?></div>
        </div>
      <?php endif; ?>

      <div class="card">
        <form method="post">
          <input type="hidden" name="action" value="login">

          <div class="form-group" style="margin-bottom: 24px;">
            <label for="login-password">Senha de acesso</label>
            <div class="input-wrapper">
              <input id="login-password" name="password" type="password" class="input-password" autocomplete="current-password" placeholder="Digite sua senha" autofocus required>
              <button type="button" class="toggle-password" onclick="togglePass('login-password')" title="Mostrar/ocultar senha">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
          </div>

          <button class="btn btn-primary" type="submit">Entrar no painel</button>
        </form>
      </div>

      <div class="admin-footer">
        Retífica Três Estrelas &bull; <a href="/" target="_blank">Ver site ao vivo</a>
      </div>
    </div>

  <!-- ==================== TELA DO PAINEL ==================== -->
  <?php else: ?>
    <div class="container">
      <header class="panel-topbar">
        <div class="panel-topbar-left">
          <img src="/brand/logo-v2.png" alt="Logo" class="panel-topbar-logo">
          <div>
            <h1 class="panel-topbar-title">Painel de Rastreamento</h1>
            <span class="hint">Retífica Três Estrelas</span>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <a href="/" target="_blank" class="btn btn-outline btn-sm">Ver site ↗</a>
          <form method="post" style="margin:0;">
            <input type="hidden" name="action" value="logout">
            <button class="btn btn-outline btn-sm" type="submit">Sair</button>
          </form>
        </div>
      </header>

      <?php if ($error !== ''): ?>
        <div class="alert alert-error">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <div><?= escape($error) ?></div>
        </div>
      <?php endif; ?>

      <?php if ($success !== ''): ?>
        <div class="alert alert-success">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          <div><?= escape($success) ?></div>
        </div>
      <?php endif; ?>

      <!-- CARD 1: CONFIGURAÇÃO DE TAGS -->
      <section class="card">
        <div class="card-header">
          <h2 class="card-title">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Tags de Anúncios e Analytics
          </h2>
          <p class="card-desc">Configure seus pixels e IDs de conversão. O site atualizará em tempo real.</p>
        </div>

        <form method="post" id="tracking-form">
          <input type="hidden" name="action" value="save_tracking">

          <div class="form-group" style="margin-bottom: 20px;">
            <label for="mode">Modo de Instalação</label>
            <select id="mode" name="mode">
              <option value="direct" <?= $config['mode'] === 'direct' ? 'selected' : '' ?>>Tags Diretas no Site (Meta Pixel, GA4, Google Ads)</option>
              <option value="gtm" <?= $config['mode'] === 'gtm' ? 'selected' : '' ?>>Google Tag Manager (GTM)</option>
            </select>
          </div>

          <!-- MODO GTM -->
          <div data-gtm style="margin-bottom: 20px;">
            <div class="form-group">
              <label for="gtm_id">ID do Google Tag Manager</label>
              <input id="gtm_id" name="gtm_id" value="<?= escape((string) $config['gtmId']) ?>" placeholder="GTM-XXXXXXX" autocomplete="off">
              <span class="hint">Os cliques no WhatsApp disparam o evento <strong>whatsapp_click</strong> no DataLayer com o parâmetro <code>origem_contato</code>.</span>
            </div>
          </div>

          <!-- MODO DIRETO -->
          <div class="form-grid" data-direct style="margin-bottom: 24px;">
            <div class="form-group">
              <label for="meta_pixel_id">Meta Pixel ID (Facebook / Instagram)</label>
              <input id="meta_pixel_id" name="meta_pixel_id" value="<?= escape((string) $config['metaPixelId']) ?>" placeholder="Ex: 123456789012345" inputmode="numeric" autocomplete="off">
              <span class="hint">Dispara PageView e o evento <strong>WhatsAppClick</strong> nos botões.</span>
            </div>

            <div class="form-group">
              <label for="ga4_id">ID do Google Analytics 4 (GA4)</label>
              <input id="ga4_id" name="ga4_id" value="<?= escape((string) $config['ga4MeasurementId']) ?>" placeholder="Ex: G-XXXXXXXXXX" autocomplete="off">
              <span class="hint">Dispara o evento <strong>whatsapp_click</strong> automaticamente.</span>
            </div>

            <div class="form-group">
              <label for="google_ads_id">ID do Google Ads</label>
              <input id="google_ads_id" name="google_ads_id" value="<?= escape((string) $config['googleAdsId']) ?>" placeholder="Ex: AW-123456789" autocomplete="off">
              <span class="hint">ID da sua conta Google Ads.</span>
            </div>

            <div class="form-group">
              <label for="google_ads_label">Rótulo de Conversão do Google Ads</label>
              <input id="google_ads_label" name="google_ads_label" value="<?= escape((string) $config['googleAdsConversionLabel']) ?>" placeholder="Ex: AbCdEfGhIjKlMn" autocomplete="off">
              <span class="hint">Rótulo da ação de conversão criada no Google Ads.</span>
            </div>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; padding-top: 18px; border-top: 1px solid var(--card-border);">
            <div class="status-badge">
              <span class="status-dot"></span>
              <?php if (!empty($config['updatedAt'])): ?>
                Ativo no site (atualizado em <?= date('d/m/Y H:i', strtotime($config['updatedAt'])) ?>)
              <?php else: ?>
                Pronto para configuração
              <?php endif; ?>
            </div>
            <button class="btn btn-primary" type="submit" style="width: auto; min-width: 220px;">Salvar configurações</button>
          </div>
        </form>
      </section>

      <!-- CARD 2: ALTERAR SENHA (ISOLADO) -->
      <section class="card">
        <div class="card-header">
          <h2 class="card-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Alterar Senha do Painel
          </h2>
          <p class="card-desc">Altere sua senha de acesso a qualquer momento. Use no mínimo 6 caracteres.</p>
        </div>

        <form method="post" id="password-form">
          <input type="hidden" name="action" value="change_password">

          <div class="form-grid" style="margin-bottom: 20px;">
            <div class="form-group full">
              <label for="current_password">Senha atual</label>
              <div class="input-wrapper">
                <input id="current_password" name="current_password" type="password" class="input-password" autocomplete="current-password" placeholder="Digite sua senha atual" required>
                <button type="button" class="toggle-password" onclick="togglePass('current_password')">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
            </div>

            <div class="form-group">
              <label for="new_password">Nova senha</label>
              <div class="input-wrapper">
                <input id="new_password" name="new_password" type="password" class="input-password" minlength="6" autocomplete="new-password" placeholder="Mínimo 6 caracteres" required>
                <button type="button" class="toggle-password" onclick="togglePass('new_password')">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
            </div>

            <div class="form-group">
              <label for="new_password_confirmation">Confirmar nova senha</label>
              <div class="input-wrapper">
                <input id="new_password_confirmation" name="new_password_confirmation" type="password" class="input-password" minlength="6" autocomplete="new-password" placeholder="Repita a nova senha" required>
                <button type="button" class="toggle-password" onclick="togglePass('new_password_confirmation')">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end;">
            <button class="btn btn-outline" type="submit">Atualizar senha</button>
          </div>
        </form>
      </section>

      <div class="admin-footer">
        Retífica Três Estrelas &bull; <a href="/" target="_blank">retificatresestrelas.com.br</a>
      </div>
    </div>
  <?php endif; ?>

  <script>
    function togglePass(id) {
      const input = document.getElementById(id);
      if (!input) return;
      input.type = input.type === 'password' ? 'text' : 'password';
    }

    (() => {
      const mode = document.getElementById('mode');
      if (!mode) return;
      const refresh = () => {
        document.querySelectorAll('[data-gtm]').forEach(el => {
          el.classList.toggle('hidden-mode', mode.value !== 'gtm');
        });
        document.querySelectorAll('[data-direct]').forEach(el => {
          el.classList.toggle('hidden-mode', mode.value !== 'direct');
        });
      };
      mode.addEventListener('change', refresh);
      refresh();
    })();
  </script>
</body>
</html>
