<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/auth.php';

setCorsHeaders();
requireRole('conducteur', 'admin');

$body = getJsonBody();

$id_bus = (int) ($body['id_bus'] ?? 0);
$lat    = (float) ($body['latitude'] ?? 0);
$lng    = (float) ($body['longitude'] ?? 0);

if (!$id_bus || !$lat || !$lng) {
    jsonError("Paramètres invalides");
}

$pdo = getDB();

// vérifier bus
$stmt = $pdo->prepare("SELECT id_bus, matricule FROM bus WHERE id_bus = ? AND en_service = 1");
$stmt->execute([$id_bus]);
$bus = $stmt->fetch();

if (!$bus) {
    jsonError("Bus introuvable", 404);
}

// vérifier conducteur
$payload = requireAuth();

if ($payload['role'] === 'conducteur') {
    if ($bus['matricule'] != $payload['matricule']) {
        jsonError("Accès refusé", 403);
    }
}

// insert position
$stmt = $pdo->prepare("
    INSERT INTO bus_position (latitude, longitude, horodatage, id_bus)
    VALUES (?, ?, NOW(), ?)
");
$stmt->execute([$lat, $lng, $id_bus]);

jsonResponse(['message' => 'Position enregistrée']);