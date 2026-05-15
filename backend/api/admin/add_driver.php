<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

require_once '../../config/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if (
    empty($data['nom']) || 
    empty($data['email']) || 
    empty($data['telephone']) || 
    empty($data['mot_de_passe']) || 
    empty($data['matricule'])
) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Veuillez remplir tous les champs obligatoires."]);
    exit();
}

try {
    $pdo = getDB();
    
    // Check if email already exists
    $stmtCheck = $pdo->prepare("SELECT id_user FROM users WHERE email = ?");
    $stmtCheck->execute([$data['email']]);
    if ($stmtCheck->fetch()) {
        http_response_code(409);
        echo json_encode(["status" => "error", "message" => "Cet email est déjà utilisé."]);
        exit();
    }
    
    // Check if matricule already exists
    $stmtCheckMatricule = $pdo->prepare("SELECT id_user FROM conducteur WHERE matricule = ?");
    $stmtCheckMatricule->execute([$data['matricule']]);
    if ($stmtCheckMatricule->fetch()) {
        http_response_code(409);
        echo json_encode(["status" => "error", "message" => "Ce matricule est déjà attribué."]);
        exit();
    }

    $pdo->beginTransaction();

    // 1. Insert into users table
    $hashedPassword = password_hash($data['mot_de_passe'], PASSWORD_DEFAULT);
    // Determine the exact role spelling. Usually 'conducteur'
    $role = 'conducteur'; 
    $stmtUser = $pdo->prepare("INSERT INTO users (nom, email, telephone, password, role) VALUES (?, ?, ?, ?, ?)");
    $stmtUser->execute([
        $data['nom'],
        $data['email'],
        $data['telephone'],
        $hashedPassword,
        $role
    ]);
    
    $userId = $pdo->lastInsertId();

    // 2. Insert into conducteur table
    $stmtDriver = $pdo->prepare("INSERT INTO conducteur (id_user, matricule, gps_active) VALUES (?, ?, ?)");
    $stmtDriver->execute([
        $userId,
        $data['matricule'],
        0
    ]);

    $pdo->commit();

    echo json_encode([
        "status" => "success", 
        "message" => "Conducteur ajouté avec succès.",
        "data" => [
            "id_user" => $userId,
            "nom" => $data['nom'],
            "email" => $data['email'],
            "telephone" => $data['telephone'],
            "matricule" => $data['matricule'],
            "gps_active" => 0,
            "date_ajout" => date('Y-m-d H:i:s')
        ]
    ]);

} catch (PDOException $e) {
    if ($pdo && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Erreur de base de données: " . $e->getMessage()]);
}
?>
