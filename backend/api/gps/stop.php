<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/auth.php';

setCorsHeaders();

$user = requireAuth();

if ($user['role'] !== 'conducteur') {
    jsonError("Accès refusé", 403);
}

$pdo = getDB();

$stmt = $pdo->prepare("
    UPDATE conducteur 
    SET gps_active = 0 
    WHERE id_user = ?
");

$stmt->execute([$user['id_user']]);

jsonResponse("GPS désactivé avec succès");