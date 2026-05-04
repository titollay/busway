<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/auth.php';

setCorsHeaders();

// 🔒 فقط admin
requireRole('admin');

$pdo = getDB();
$body = getJsonBody();

$nom = trim($body['nom'] ?? '');
$email = trim($body['email'] ?? '');
$password = $body['password'] ?? '';
$role = $body['role'] ?? 'user';

if (!$nom || !$email || !$password) {
    jsonError("Tous les champs sont requis");
}

// ✔️ validation email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonError("Email invalide");
}

// ✔️ vérifier email unique
$stmt = $pdo->prepare("SELECT id_user FROM users WHERE email = ?");
$stmt->execute([$email]);

if ($stmt->fetch()) {
    jsonError("Email déjà utilisé", 409);
}

// ✔️ créer user
$stmt = $pdo->prepare("
    INSERT INTO users (nom, email, password, role)
    VALUES (?, ?, ?, ?)
");

$stmt->execute([
    $nom,
    $email,
    password_hash($password, PASSWORD_BCRYPT),
    $role
]);

$userId = (int)$pdo->lastInsertId();

// 👨‍✈️ إذا conducteur
if ($role === 'conducteur') {

    // 🔥 توليد matricule unique
    do {
        $matricule = rand(1000, 9999);

        $check = $pdo->prepare("SELECT matricule FROM conducteur WHERE matricule = ?");
        $check->execute([$matricule]);

    } while ($check->fetch());

    $pdo->prepare("
        INSERT INTO conducteur (matricule, id_user)
        VALUES (?, ?)
    ")->execute([$matricule, $userId]);
}

jsonResponse([
    'success' => true,
    'message' => 'Utilisateur créé avec succès',
    'data' => [
        'id_user' => $userId,
        'role' => $role
    ]
], 201);