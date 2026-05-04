<?php
// backend/api/bus/get_all_positions.php
// Retourne la dernière position GPS de TOUS les bus actifs
// Utilisé par la carte usager en temps réel

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonError('Méthode non autorisée', 405);
}

$pdo = getDB();

// Dernière position de chaque bus actif + infos ligne
$stmt = $pdo->query("
    SELECT 
        b.id_bus,
        b.immatriculation,
        b.modele,
        b.capacite,
        b.en_service,
        l.id_ligne,
        l.nom_ligne,
        l.point_depart,
        l.point_arrivee,
        bp.latitude,
        bp.longitude,
        bp.horodatage
    FROM bus b
    LEFT JOIN ligne l ON l.id_ligne = b.id_ligne
    LEFT JOIN bus_position bp ON bp.id_position = (
        SELECT id_position
        FROM bus_position
        WHERE id_bus = b.id_bus
        ORDER BY horodatage DESC
        LIMIT 1
    )
    WHERE b.en_service = 1
    ORDER BY b.id_bus
");

$positions = $stmt->fetchAll();

jsonResponse([
    'positions' => $positions,
    'total'     => count($positions),
    'timestamp' => date('Y-m-d H:i:s'),
]);
