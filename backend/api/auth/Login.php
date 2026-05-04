<?php
// backend/api/auth/Login.php

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/auth.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Méthode non autorisée', 405);
}

$body     = getJsonBody();
$email    = trim($body['email'] ?? '');
$password = $body['password'] ?? '';

// Validation
if (!$email || !$password) {
    jsonError('Email et mot de passe requis');
}

$pdo  = getDB();
$stmt = $pdo->prepare("SELECT * FROM user WHERE email = ? LIMIT 1");
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password'])) {
    jsonError('Email ou mot de passe incorrect', 401);
}

$token = generateToken([
    'id_user' => $user['id_user'],
    'email'   => $user['email'],
    'role'    => $user['role'],
]);

jsonResponse([
    'message' => 'Connexion réussie',
    'token'   => $token,
    'user'    => [
        'id_user'   => $user['id_user'],
        'nom'       => $user['nom'],
        'email'     => $user['email'],
        'telephone' => $user['telephone'],
        'role'      => $user['role'],
    ],
]);
