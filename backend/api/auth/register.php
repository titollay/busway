<?php
// backend/api/auth/register.php

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/auth.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Méthode non autorisée', 405);
}

$body      = getJsonBody();
$nom       = trim($body['nom'] ?? '');
$email     = trim($body['email'] ?? '');
$password  = $body['password'] ?? '';
$telephone = trim($body['telephone'] ?? '');

// Validation
if (!$nom || !$email || !$password) {
    jsonError('Nom, email et mot de passe sont requis');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonError('Email invalide');
}
if (strlen($password) < 8) {
    jsonError('Le mot de passe doit contenir au moins 8 caractères');
}

$pdo = getDB();

// Email déjà utilisé ?
$stmt = $pdo->prepare("SELECT id_user FROM user WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->fetch()) {
    jsonError('Cet email est déjà utilisé', 409);
}

// Insertion
$stmt = $pdo->prepare("
    INSERT INTO user (nom, email, password, telephone, role)
    VALUES (?, ?, ?, ?, 'user')
");
$stmt->execute([$nom, $email, password_hash($password, PASSWORD_BCRYPT), $telephone ?: null]);

$userId = (int) $pdo->lastInsertId();

$token = generateToken([
    'id_user' => $userId,
    'email'   => $email,
    'role'    => 'user',
]);

jsonResponse([
    'message' => 'Compte créé avec succès',
    'token'   => $token,
    'user'    => [
        'id_user' => $userId,
        'nom'     => $nom,
        'email'   => $email,
        'role'    => 'user',
    ],
], 201);
