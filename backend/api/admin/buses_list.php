<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

require_once '../../config/db.php';

try {
    // Get buses with line info
    $stmt = $pdo->query("
        SELECT b.id_bus, b.matricule, b.immatriculation, b.id_ligne, l.nom_ligne
        FROM bus b
        LEFT JOIN ligne l ON b.id_ligne = l.id_ligne
    ");
    $buses = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // active status logic could be enhanced if tracking is stored, currently returning as is
    echo json_encode(["status" => "success", "data" => $buses]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
