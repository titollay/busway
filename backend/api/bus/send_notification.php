<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';

setCorsHeaders();

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["status" => "error", "message" => "No data received"]);
    exit;
}

if (!isset($data['id_user']) || !isset($data['message'])) {
    echo json_encode(["status" => "error", "message" => "Missing id_user or message"]);
    exit;
}

$id_user = $data['id_user'];
$message = $data['message'];
$type = $data['type'] ?? 'Incident';

try {
    $pdo = getDB();

    // Insert into DB
    $query = "INSERT INTO notification (id_user, message, type, date_heure, lu) VALUES (:id_user, :message, :type, NOW(), 0)";
    $stmt = $pdo->prepare($query);
    $stmt->execute([
        ':id_user' => $id_user,
        ':message' => $message,
        ':type'    => $type
    ]);

    // BROADCASTING (Bring back with logging)
    try {
        $socket_url = "http://localhost:4000/send-alert";
        $ch = curl_init($socket_url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        // 🚌 Get Bus immatriculation for the notification via Driver's matricule
        $stmtBus = $pdo->prepare("
            SELECT b.immatriculation 
            FROM bus b 
            JOIN conducteur c ON b.matricule = c.matricule 
            WHERE c.id_user = ? 
            LIMIT 1
        ");
        $stmtBus->execute([$id_user]);
        $busRow = $stmtBus->fetch(PDO::FETCH_ASSOC);
        $bus_number = $busRow ? $busRow['immatriculation'] : $id_user;

        // 📡 Broadcast notification via Socket.io server
        $socketData = [
            "id_bus" => $id_user,
            "bus_number" => $bus_number,
            "message" => $message,
            "type" => $type,
            "time" => date("H:i")
        ];
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($socketData));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_TIMEOUT, 2);
        curl_exec($ch);
        curl_close($ch);
    } catch (Exception $e) { /* ignore socket errors for now */ }

    echo json_encode(["status" => "success", "message" => "Added to DB & Broadcasted"]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "DB Error: " . $e->getMessage()]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "General Error: " . $e->getMessage()]);
}
?>
