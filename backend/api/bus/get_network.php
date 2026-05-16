<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/cors.php';

setCorsHeaders();
$pdo = getDB();

try {
    // Get all stops
    $stops = $pdo->query("SELECT * FROM arret")->fetchAll(PDO::FETCH_ASSOC);
    
    // Get all lines to show on map or filter
    $lines = $pdo->query("SELECT * FROM ligne")->fetchAll(PDO::FETCH_ASSOC);

    // Reconstruct paths dynamically from ligne_arret matching real seeded IDs
    $stmt = $pdo->query("
        SELECT la.id_ligne, a.latitude, a.longitude
        FROM ligne_arret la
        JOIN arret a ON la.id_arret = a.id_arret
        ORDER BY la.id_ligne, la.ordre ASC
    ");
    $ligne_arrets = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $paths = [];
    foreach ($ligne_arrets as $row) {
        $line_id = $row['id_ligne'];
        if (!isset($paths[$line_id])) {
            $paths[$line_id] = [];
        }
        $paths[$line_id][] = [floatval($row['latitude']), floatval($row['longitude'])];
    }

    // Colors matching all 7 Oujda lines
    $colors = [
        1 => '#8b5cf6', // Purple
        2 => '#f97316', // Orange
        3 => '#3b82f6', // Blue
        4 => '#ef4444', // Red
        5 => '#10b981', // Green
        6 => '#eab308', // Yellow
        7 => '#ec4899'  // Pink
    ];

    $formattedPaths = [];
    foreach ($paths as $line_id => $coords) {
        $formattedPaths[] = [
            'id_ligne' => $line_id,
            'color' => $colors[$line_id] ?? '#10b981',
            'coordinates' => $coords
        ];
    }

    jsonResponse([
        'success' => true,
        'arrets' => $stops,
        'lignes' => $lines,
        'paths' => $formattedPaths
    ]);
} catch (Exception $e) {
    jsonError($e->getMessage());
}
