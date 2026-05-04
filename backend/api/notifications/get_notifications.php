<?php
// backend/api/notifications/get_notifications.php
// GET → notifications de l'utilisateur connecté

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/auth.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonError('Méthode non autorisée', 405);
}

$payload = requireAuth();
$pdo     = getDB();

// Notifications de cet utilisateur
$stmt = $pdo->prepare("
    SELECT id_notification, message, date_heure, lu
    FROM notification
    WHERE id_user = ?
    ORDER BY date_heure DESC
    LIMIT 50
");
$stmt->execute([$payload['id_user']]);
$notifications = $stmt->fetchAll();

// Compter les non lues
$stmt = $pdo->prepare("SELECT COUNT(*) FROM notification WHERE id_user = ? AND lu = 0");
$stmt->execute([$payload['id_user']]);
$nb_non_lues = (int) $stmt->fetchColumn();

jsonResponse([
    'notifications' => $notifications,
    'total'         => count($notifications),
    'non_lues'      => $nb_non_lues,
]);
