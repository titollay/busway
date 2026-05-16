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

// 🚌 Get Bus Info
$stmtBus = $pdo->prepare("
    SELECT b.id_bus, l.nom_ligne 
    FROM bus b 
    LEFT JOIN ligne l ON b.id_ligne = l.id_ligne 
    WHERE b.matricule = ?
");
$stmtBus->execute([$payload['matricule']]);
$busInfo = $stmtBus->fetch(PDO::FETCH_ASSOC);

if (!$busInfo) {
    jsonError("Aucun bus associé à ce matricule", 400);
}

// 💾 insert position
$stmt = $pdo->prepare("
    INSERT INTO bus_position (latitude, longitude, horodatage, id_bus)
    VALUES (?, ?, NOW(), ?)
");

$stmt->execute([
    $lat,
    $lng,
    $busInfo['id_bus']
]);

// 📡 Broadcast to WebSocket server
$ch = curl_init('http://localhost:4000/update-bus');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['fleet' => [
    [
        'id_bus' => $busInfo['id_bus'],
        'latitude' => $lat,
        'longitude' => $lng,
        'nom_ligne' => $busInfo['nom_ligne'] ?: "En Service"
    ]
]]));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_TIMEOUT, 1);
curl_exec($ch);
curl_close($ch);

jsonResponse("Position enregistrée et diffusée avec succès");