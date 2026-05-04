<?php
// backend/config/auth.php

$jwtSecret = $_ENV['JWT_SECRET'] ?? null;
if (!$jwtSecret) {
    http_response_code(500);
    echo json_encode(['error' => 'JWT_SECRET manquant dans les variables d\'environnement']);
    exit;
}
define('JWT_SECRET', $jwtSecret);
define('JWT_EXPIRY', 60 * 60 * 24 * 7); // 7 jours

function generateToken(array $payload): string {
    $header  = base64url_encode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
    $payload['iat'] = time();
    $payload['exp'] = time() + JWT_EXPIRY;
    $pay     = base64url_encode(json_encode($payload));
    $sig     = base64url_encode(hash_hmac('sha256', "$header.$pay", JWT_SECRET, true));
    return "$header.$pay.$sig";
}

function verifyToken(string $token): ?array {
    $parts = explode('.', $token);
    if (count($parts) !== 3) return null;
    [$h, $p, $s] = $parts;
    $expected = base64url_encode(hash_hmac('sha256', "$h.$p", JWT_SECRET, true));
    if (!hash_equals($expected, $s)) return null;
    $data = json_decode(base64url_decode($p), true);
    if (!$data || ($data['exp'] ?? 0) < time()) return null;
    return $data;
}

function getTokenFromRequest(): ?string {
    $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    return str_starts_with($auth, 'Bearer ') ? substr($auth, 7) : null;
}

function requireAuth(): array {
    $token = getTokenFromRequest();
    if (!$token) jsonError('Token manquant', 401);
    $payload = verifyToken($token);
    if (!$payload) jsonError('Token invalide ou expiré', 401);
    return $payload;
}

function requireRole(string ...$roles): array {
    $payload = requireAuth();
    if (!in_array($payload['role'] ?? '', $roles, true)) {
        jsonError('Accès refusé', 403);
    }
    return $payload;
}

function base64url_encode(string $d): string {
    return rtrim(strtr(base64_encode($d), '+/', '-_'), '=');
}

function base64url_decode(string $d): string {
    return base64_decode(strtr($d, '-_', '+/') . str_repeat('=', (4 - strlen($d) % 4) % 4));
}