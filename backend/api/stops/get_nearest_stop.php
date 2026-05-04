<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/cors.php';

setCorsHeaders();

$pdo = getDB();

$lat = $_GET['lat'] ?? null;
$lng = $_GET['lng'] ?? null;

if (!$lat || !$lng) {
    jsonError("Paramètres manquants");
}

$stmt = $pdo->prepare("
    SELECT *,
    (
        6371 * acos(
            cos(radians(?)) *
            cos(radians(latitude)) *
            cos(radians(longitude) - radians(?)) +
            sin(radians(?)) *
            sin(radians(latitude))
        )
    ) AS distance
    FROM arret
    ORDER BY distance ASC
    LIMIT 1
");

$stmt->execute([$lat, $lng, $lat]);
$arret = $stmt->fetch();

jsonResponse([
    'success' => true,
    'data' => $arret
]);