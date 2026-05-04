<?php
// backend/api/notifications/mark_notif.php
// PUT ?id_notif=X     → marquer une notif comme lue
// PUT ?all=1          → tout marquer comme lu
// POST                → envoyer une notif (admin)
// DELETE ?id_notif=X  → supprimer

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/auth.php';

setCorsHeaders();

$method   = $_SERVER['REQUEST_METHOD'];
$payload  = requireAuth();
$pdo      = getDB();

// ── PUT : marquer comme lu ───────────────────────────────
if ($method === 'PUT') {
    // Tout marquer
    if (!empty($_GET['all'])) {
        $pdo->prepare("UPDATE notification SET lu = 1 WHERE id_user = ?")
            ->execute([$payload['id_user']]);

        jsonResponse(['message' => 'Toutes les notifications marquées comme lues']);
    }

    // Une seule
    $id = isset($_GET['id_notif']) ? (int) $_GET['id_notif'] : null;
    if (!$id) jsonError('Paramètre id_notif requis');

    $stmt = $pdo->prepare("UPDATE notification SET lu = 1 WHERE id_notification = ? AND id_user = ?");
    $stmt->execute([$id, $payload['id_user']]);

    if ($stmt->rowCount() === 0) jsonError('Notification introuvable', 404);

    jsonResponse(['message' => 'Notification marquée comme lue']);
}

// ── POST : envoyer une notification (admin seulement) ────
if ($method === 'POST') {
    requireRole('admin');

    $body    = getJsonBody();
    $message = trim($body['message'] ?? '');
    $id_user = $body['id_user'] ?? null; // null = broadcast

    if (!$message) jsonError('Message requis');

    if ($id_user) {
        $pdo->prepare("INSERT INTO notification (message, date_heure, lu, id_user) VALUES (?, NOW(), 0, ?)")
            ->execute([$message, $id_user]);

        jsonResponse(['message' => 'Notification envoyée'], 201);
    } else {
        // Broadcast à tous les utilisateurs
        $users = $pdo->query("SELECT id_user FROM user")->fetchAll(PDO::FETCH_COLUMN);
        $stmt  = $pdo->prepare("INSERT INTO notification (message, date_heure, lu, id_user) VALUES (?, NOW(), 0, ?)");

        $pdo->beginTransaction();
        foreach ($users as $uid) {
            $stmt->execute([$message, $uid]);
        }
        $pdo->commit();

        jsonResponse(['message' => 'Notification envoyée à ' . count($users) . ' utilisateur(s)'], 201);
    }
}

// ── DELETE ───────────────────────────────────────────────
if ($method === 'DELETE') {
    $id = isset($_GET['id_notif']) ? (int) $_GET['id_notif'] : null;
    if (!$id) jsonError('Paramètre id_notif requis');

    $where  = $payload['role'] === 'admin' ? "id_notification = ?" : "id_notification = ? AND id_user = ?";
    $params = $payload['role'] === 'admin' ? [$id] : [$id, $payload['id_user']];

    $stmt = $pdo->prepare("DELETE FROM notification WHERE $where");
    $stmt->execute($params);

    if ($stmt->rowCount() === 0) jsonError('Notification introuvable', 404);

    jsonResponse(['message' => 'Notification supprimée']);
}

jsonError('Méthode non autorisée', 405);
