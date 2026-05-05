<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/auth.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError("Méthode non autorisée", 405);
}

$body = getJsonBody();
$email = trim($body['email'] ?? '');
$password = $body['password'] ?? '';

if (!$email || !$password) {
    jsonError("Email et mot de passe requis");
}

$pdo = getDB();

// 🔥 JOIN avec conducteur
$stmt = $pdo->prepare("
    SELECT u.*, c.matricule
    FROM users u
    LEFT JOIN conducteur c ON c.id_user = u.id_user
    WHERE u.email = ?
    LIMIT 1
");
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password'])) {
    jsonError("Email ou mot de passe incorrect", 401);
}
    
// ✅ Fix — fetch matricule if conductor, then include it
$matricule = null;
if ($user['role'] === 'conducteur') {
    $stmt2 = $pdo->prepare("SELECT matricule FROM conducteur WHERE id_user = ?");
    $stmt2->execute([$user['id_user']]);
    $row = $stmt2->fetch();
    $matricule = $row ? (int)$row['matricule'] : null;
}

$token = generateToken([
    'id_user'   => $user['id_user'],
    'email'     => $user['email'],
    'role'      => $user['role'],
    'matricule' => $matricule,
]);

jsonResponse([
    'success' => true,
    'message' => 'Connexion réussie',
    'token' => $token,
    'user' => [
        'id_user' => $user['id_user'],
        'nom' => $user['nom'],
        'email' => $user['email'],
        'role' => $user['role'],
        'matricule' => $user['matricule']
    ]
]);