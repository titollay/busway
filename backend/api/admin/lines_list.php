<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

require_once '../../config/db.php';

try {
    // Get lines and their count of stops
    $stmt = $pdo->query("
        SELECT l.id_ligne, l.nom_ligne, l.point_depart, l.point_arrivee, 
               COUNT(la.id_arret) as stops_count
        FROM ligne l
        LEFT JOIN ligne_arret la ON l.id_ligne = la.id_ligne
        GROUP BY l.id_ligne
        ORDER BY l.nom_ligne ASC
    ");
    $lines = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["status" => "success", "data" => $lines]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
