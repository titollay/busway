<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/auth.php';

setCorsHeaders();

// 🔐 auth
$payload = requireAuth();

if ($payload['role'] !== 'conducteur') {
    jsonError("Accès refusé", 403);
}

$pdo = getDB();

// 🔍 check GPS status
$stmt = $pdo->prepare("
    SELECT gps_active 
    FROM conducteur 
    WHERE id_user = ?
");

$stmt->execute([$payload['id_user']]);
$driver = $stmt->fetch();

// 🚫 if GPS OFF
if (!$driver || (int)$driver['gps_active'] === 0) {
    jsonError("GPS est désactivé", 403);
}

// 📍 read position data
$body = getJsonBody();

$lat = $body['latitude'] ?? null;
$lng = $body['longitude'] ?? null;

// validation (optional but recommended)
if ($lat === null || $lng === null) {
    jsonError("Coordonnées manquantes");
}

if (!is_numeric($lat) || !is_numeric($lng)) {
    jsonError("Coordonnées invalides");
}

$lat = (float)$lat;
$lng = (float)$lng;

// 🌍 GPS range validation
if ($lat < -90 || $lat > 90) {
    jsonError("Latitude invalide");
}

if ($lng < -180 || $lng > 180) {
    jsonError("Longitude invalide");
}

// 💾 insert position
$stmt = $pdo->prepare("
    INSERT INTO bus_position (latitude, longitude, horodatage, id_bus)
    VALUES (?, ?, NOW(), (
        SELECT id_bus FROM bus WHERE matricule = ?
    ))
");

$stmt->execute([
    $lat,
    $lng,
    $payload['matricule']
]);

jsonResponse("Position enregistrée avec succès");