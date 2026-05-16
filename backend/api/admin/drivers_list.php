<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

require_once '../../config/db.php';

try {
    $pdo = getDB();
    $stmt = $pdo->query("
        SELECT u.id_user, c.matricule, c.gps_active, u.nom, u.email, u.telephone, u.date_ajout, u.image
        FROM conducteur c
        JOIN users u ON c.id_user = u.id_user
        ORDER BY u.date_ajout DESC
    ");
    $drivers = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["success" => true, "status" => "success", "data" => $drivers]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
