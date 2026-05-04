<?php
// backend/api/bus/get_position.php
// Retourne la dernière position GPS d'un bus précis
// GET ?id_bus=3

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonError('Méthode non autorisée', 405);
}

$id_bus = isset($_GET['id_bus']) ? (int) $_GET['id_bus'] : null;

if (!$id_bus) {
    jsonError('Paramètre id_bus requis');
}

$pdo = getDB();

// Vérifier que le bus existe
$stmt = $pdo->prepare("SELECT id_bus, immatriculation, modele, en_service FROM bus WHERE id_bus = ?");
$stmt->execute([$id_bus]);
$bus = $stmt->fetch();

if (!$bus) {
    jsonError('Bus introuvable', 404);
}

// Dernière position
$stmt = $pdo->prepare("
    SELECT latitude, longitude, horodatage
    FROM bus_position
    WHERE id_bus = ?
    ORDER BY horodatage DESC
    LIMIT 1
");
$stmt->execute([$id_bus]);
$position = $stmt->fetch();

if (!$position) {
    jsonError('Aucune position GPS enregistrée pour ce bus', 404);
}

// Historique du jour (pour tracer la trajectoire)
$stmt = $pdo->prepare("
    SELECT latitude, longitude, horodatage
    FROM bus_position
    WHERE id_bus = ? AND DATE(horodatage) = CURDATE()
    ORDER BY horodatage ASC
");
$stmt->execute([$id_bus]);
$historique = $stmt->fetchAll();

jsonResponse([
    'bus'       => $bus,
    'position'  => $position,
    'historique' => $historique,
]);
