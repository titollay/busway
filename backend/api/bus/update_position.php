<?php
// backend/api/bus/update_position.php
// Le conducteur envoie sa position GPS en temps réel
// POST — token conducteur requis

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/auth.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Méthode non autorisée', 405);
}

// Authentification — conducteur ou admin
$payload = requireRole('conducteur', 'admin');

$body      = getJsonBody();
$id_bus    = isset($body['id_bus'])    ? (int)   $body['id_bus']    : null;
$latitude  = isset($body['latitude'])  ? (float) $body['latitude']  : null;
$longitude = isset($body['longitude']) ? (float) $body['longitude'] : null;

if (!$id_bus || $latitude === null || $longitude === null) {
    jsonError('id_bus, latitude et longitude sont requis');
}

// Vérifier coordonnées valides
if ($latitude < -90 || $latitude > 90 || $longitude < -180 || $longitude > 180) {
    jsonError('Coordonnées GPS invalides');
}

$pdo = getDB();

// Vérifier que le bus existe et est en service
$stmt = $pdo->prepare("SELECT id_bus, matricule FROM bus WHERE id_bus = ? AND en_service = 1");
$stmt->execute([$id_bus]);
$bus = $stmt->fetch();

if (!$bus) {
    jsonError('Bus introuvable ou hors service', 404);
}

// Un conducteur ne peut mettre à jour que son propre bus
if ($payload['role'] === 'conducteur') {
    // Récupérer le matricule du conducteur via son id_user
    $stmt = $pdo->prepare("SELECT matricule FROM conducteur WHERE matricule = ?");
    $stmt->execute([$payload['matricule'] ?? 0]);
    if (!$stmt->fetch() || $bus['matricule'] != ($payload['matricule'] ?? 0)) {
        jsonError('Vous n\'êtes pas assigné à ce bus', 403);
    }
}

// Insérer la nouvelle position
$stmt = $pdo->prepare("
    INSERT INTO bus_position (latitude, longitude, horodatage, id_bus)
    VALUES (?, ?, NOW(), ?)
");
$stmt->execute([$latitude, $longitude, $id_bus]);

// Mettre à jour gps_active du conducteur
if (!empty($payload['matricule'])) {
    $pdo->prepare("UPDATE conducteur SET gps_active = 1 WHERE matricule = ?")
        ->execute([$payload['matricule']]);
}

jsonResponse([
    'message'   => 'Position mise à jour',
    'id_bus'    => $id_bus,
    'latitude'  => $latitude,
    'longitude' => $longitude,
    'timestamp' => date('Y-m-d H:i:s'),
], 201);
