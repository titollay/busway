<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

require_once '../../config/db.php';

try {
    $pdo = getDB();

    $stmt = $pdo->query("
        SELECT
            id_user,
            nom,
            '' AS prenom,
            email,
            telephone,
            date_ajout AS created_at,
            role
        FROM users
        WHERE role = 'user'
        ORDER BY date_ajout DESC
    ");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["status" => "success", "data" => $users]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
