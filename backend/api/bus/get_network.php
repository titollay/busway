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

    jsonResponse([
        'success' => true,
        'arrets' => $stops,
        'lignes' => $lines
    ]);
} catch (Exception $e) {
    jsonError($e->getMessage());
}
