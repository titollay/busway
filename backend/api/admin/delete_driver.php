<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

require_once '../../config/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Méthode non autorisée."]);
    exit();
}

$id_user = isset($_GET['id_user']) ? $_GET['id_user'] : null;

if (empty($id_user)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "ID utilisateur manquant."]);
    exit();
}

try {
    $pdo = getDB();
    $stmt = $pdo->prepare("DELETE FROM users WHERE id_user = ?");
    $stmt->execute([$id_user]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(["status" => "success", "message" => "Conducteur supprimé avec succès."]);
    } else {
        http_response_code(404);
        echo json_encode(["status" => "error", "message" => "Utilisateur non trouvé."]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Erreur de base de données: " . $e->getMessage()]);
}
?>
