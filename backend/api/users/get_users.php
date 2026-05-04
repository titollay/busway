<?php
// backend/api/users/get_users.php
// GET /            → liste (admin)
// GET ?id_user=X  → profil d'un user
// PUT ?id_user=X  → modifier son profil
// DELETE ?id_user=X → supprimer (admin)

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/auth.php';

setCorsHeaders();

$method  = $_SERVER['REQUEST_METHOD'];
$payload = requireAuth();
$pdo     = getDB();
$id_user = isset($_GET['id_user']) ? (int) $_GET['id_user'] : null;

// ── GET ──────────────────────────────────────────────────
if ($method === 'GET') {
    // Mon profil : GET ?id_user=me ou sans paramètre
    if (!$id_user || $id_user === $payload['id_user']) {
        $stmt = $pdo->prepare("SELECT id_user, nom, email, telephone, role, date_ajout FROM user WHERE id_user = ?");
        $stmt->execute([$payload['id_user']]);
        jsonResponse(['user' => $stmt->fetch()]);
    }

    // Admin : liste complète
    if ($payload['role'] === 'admin') {
        if ($id_user) {
            $stmt = $pdo->prepare("SELECT id_user, nom, email, telephone, role, date_ajout FROM user WHERE id_user = ?");
            $stmt->execute([$id_user]);
            $user = $stmt->fetch();
            if (!$user) jsonError('Utilisateur introuvable', 404);
            jsonResponse(['user' => $user]);
        }

        $users = $pdo->query("SELECT id_user, nom, email, telephone, role, date_ajout FROM user ORDER BY date_ajout DESC")->fetchAll();
        jsonResponse(['users' => $users, 'total' => count($users)]);
    }

    jsonError('Accès refusé', 403);
}

// ── PUT : modifier profil ─────────────────────────────────
if ($method === 'PUT') {
    $target = $id_user ?? $payload['id_user'];

    // Un user ne peut modifier que son propre profil
    if ($payload['role'] !== 'admin' && $target !== $payload['id_user']) {
        jsonError('Accès refusé', 403);
    }

    $body   = getJsonBody();
    $fields = [];
    $values = [];

    if (!empty($body['nom'])) {
        $fields[] = 'nom = ?';
        $values[] = trim($body['nom']);
    }
    if (!empty($body['telephone'])) {
        $fields[] = 'telephone = ?';
        $values[] = trim($body['telephone']);
    }
    if (!empty($body['password'])) {
        if (strlen($body['password']) < 8) jsonError('Mot de passe trop court (8 caractères min)');
        $fields[] = 'password = ?';
        $values[] = password_hash($body['password'], PASSWORD_BCRYPT);
    }
    if (!empty($body['role']) && $payload['role'] === 'admin') {
        if (!in_array($body['role'], ['admin', 'user', 'conducteur'])) jsonError('Rôle invalide');
        $fields[] = 'role = ?';
        $values[] = $body['role'];
    }

    if (empty($fields)) jsonError('Aucun champ à modifier');

    $values[] = $target;
    $pdo->prepare("UPDATE user SET " . implode(', ', $fields) . " WHERE id_user = ?")->execute($values);

    jsonResponse(['message' => 'Profil mis à jour']);
}

// ── DELETE (admin) ────────────────────────────────────────
if ($method === 'DELETE') {
    requireRole('admin');
    if (!$id_user) jsonError('Paramètre id_user requis');

    $stmt = $pdo->prepare("DELETE FROM user WHERE id_user = ?");
    $stmt->execute([$id_user]);

    if ($stmt->rowCount() === 0) jsonError('Utilisateur introuvable', 404);

    jsonResponse(['message' => 'Utilisateur supprimé']);
}

jsonError('Méthode non autorisée', 405);
