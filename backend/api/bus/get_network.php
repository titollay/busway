<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/cors.php';

setCorsHeaders();
$pdo = getDB();

try {
    // Get all stops
    $stops = $pdo->query("SELECT * FROM arret")->fetchAll();
    
    // Get all lines to show on map or filter
    $lines = $pdo->query("SELECT * FROM ligne")->fetchAll();

    // Reconstruct paths from sequence of stop IDs for realistic map drawing
    $path_definitions = [
        1 => [1,2,15,18,12,17,16,13,14],
        2 => [7,8,9,10,11],
        3 => [4,3,9,8,7],
        4 => [13,1,14,11,10]
    ];

    $paths = [];
    foreach ($path_definitions as $line_id => $stop_ids) {
        $paths[$line_id] = [];
        foreach ($stop_ids as $id) {
            foreach ($stops as $s) {
                if ($s['id_arret'] == $id) {
                    $paths[$line_id][] = [floatval($s['latitude']), floatval($s['longitude'])];
                    break;
                }
            }
        }
    }

    $colors = [
        1 => '#8b5cf6', // Purple
        2 => '#f97316', // Orange
        3 => '#3b82f6', // Blue
        4 => '#ef4444'  // Red
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
