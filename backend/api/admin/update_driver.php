<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

require_once '../../config/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['id_user'])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "ID utilisateur manquant."]);
    exit();
}

try {
    $pdo = getDB();
    $pdo->beginTransaction();

    // 1. Update users table
    $query = "UPDATE users SET nom = ?, email = ?, telephone = ?";
    $params = [$data['nom'], $data['email'], $data['telephone']];

    if (!empty($data['mot_de_passe'])) {
        $query .= ", password = ?";
        $params[] = password_hash($data['mot_de_passe'], PASSWORD_DEFAULT);
    }
    
    if (!empty($data['image'])) {
        $query .= ", image = ?";
        $params[] = $data['image'];
    }

    $query .= " WHERE id_user = ?";
    $params[] = $data['id_user'];

    $stmtUsers = $pdo->prepare($query);
    $stmtUsers->execute($params);

    // 2. Update conducteur table (matricule)
    if (!empty($data['matricule'])) {
        $stmtCond = $pdo->prepare("UPDATE conducteur SET matricule = ? WHERE id_user = ?");
        $stmtCond->execute([$data['matricule'], $data['id_user']]);
    }

    $pdo->commit();

    echo json_encode(["status" => "success", "message" => "Conducteur mis à jour avec succès."]);

} catch (PDOException $e) {
    if ($pdo && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Erreur de base de données: " . $e->getMessage()]);
}
?>
