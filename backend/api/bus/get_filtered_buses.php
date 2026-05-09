<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/cors.php';

setCorsHeaders();
$pdo = getDB();

$id_arret = $_GET['id_arret'] ?? null;

if (!$id_arret) {
    jsonError("ID Arret manquant");
}

try {
    // 1. Find all lines that pass through this specific stop
    $stmtLines = $pdo->prepare("SELECT id_ligne FROM ligne_arret WHERE id_arret = ?");
    $stmtLines->execute([$id_arret]);
    $lineIds = $stmtLines->fetchAll(PDO::FETCH_COLUMN);

    if (empty($lineIds)) {
        jsonResponse(['success' => true, 'positions' => []]);
    }

    // 2. Find active buses belonging to these lines
    $placeholders = implode(',', array_fill(0, count($lineIds), '?'));
    $query = "
        SELECT bp.*, b.immatriculation, l.nom_ligne, l.point_depart, l.point_arrivee
        FROM bus_position bp
        JOIN bus b ON bp.id_bus = b.id_bus
        JOIN ligne l ON b.id_ligne = l.id_ligne
        WHERE b.id_ligne IN ($placeholders)
        AND bp.horodatage = (
            SELECT MAX(horodatage) 
            FROM bus_position 
            WHERE id_bus = b.id_bus
        )
    ";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute($lineIds);
    $positions = $stmt->fetchAll();

    jsonResponse([
        'success' => true,
        'positions' => $positions
    ]);
} catch (Exception $e) {
    jsonError($e->getMessage());
}
