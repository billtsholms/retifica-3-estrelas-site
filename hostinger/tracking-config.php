<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('X-Content-Type-Options: nosniff');

$defaults = [
    'mode' => 'direct',
    'gtmId' => '',
    'ga4MeasurementId' => '',
    'googleAdsId' => '',
    'googleAdsConversionLabel' => '',
    'metaPixelId' => '',
];

$configPath = __DIR__ . '/.tracking-admin/tracking.json';
$stored = [];

if (is_readable($configPath)) {
    $decoded = json_decode((string) file_get_contents($configPath), true);
    if (is_array($decoded)) {
        $stored = $decoded;
    }
}

$config = array_merge($defaults, array_intersect_key($stored, $defaults));
$config['mode'] = $config['mode'] === 'gtm' ? 'gtm' : 'direct';

$patterns = [
    'gtmId' => '/^GTM-[A-Z0-9]+$/',
    'ga4MeasurementId' => '/^G-[A-Z0-9]{6,20}$/',
    'googleAdsId' => '/^AW-[0-9]{5,20}$/',
    'googleAdsConversionLabel' => '/^[A-Za-z0-9_-]{3,100}$/',
    'metaPixelId' => '/^[0-9]{5,30}$/',
];

foreach ($patterns as $key => $pattern) {
    $value = trim((string) ($config[$key] ?? ''));
    $config[$key] = $value === '' || preg_match($pattern, $value) === 1
        ? $value
        : '';
}

echo json_encode($config, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
