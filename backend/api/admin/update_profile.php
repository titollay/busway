<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

require_once '../../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id_user'])) {
    echo json_encode(["status" => "error", "message" => "Missing user ID"]);
    exit;
}

try {
    $pdo = getDB();
    
    // We update nom, email, telephone, and image
    // Note: In a production app, we would handle image uploads to a folder, 
    // but here we'll store the base64 string for simplicity as requested.
    
    $sql = "UPDATE users SET nom = ?, email = ?, telephone = ?, image = ? WHERE id_user = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $data['nom'],
        $data['email'],
        $data['telephone'],
        $data['image'],
        $data['id_user']
    ]);

    if ($stmt->rowCount() > 0 || $stmt->errorCode() == '00000') {
        echo json_encode([
            "status" => "success", 
            "message" => "Profile updated successfully",
            "user" => [
                "id_user" => $data['id_user'],
                "nom" => $data['nom'],
                "email" => $data['email'],
                "telephone" => $data['telephone'],
                "image" => $data['image'],
                "role" => $data['role'] // Send back the role for local storage sync
            ]
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "No changes made or user not found"]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
