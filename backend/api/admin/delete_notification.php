<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

require_once '../../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['id_notification'])) {
    echo json_encode(["status" => "error", "message" => "ID manquant."]);
    exit();
}

try {
    $pdo = getDB();
    $stmt = $pdo->prepare("DELETE FROM notification WHERE id_notification = ?");
    $stmt->execute([$data['id_notification']]);
    echo json_encode(["status" => "success", "message" => "Notification supprimée."]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
