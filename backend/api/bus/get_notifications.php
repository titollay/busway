<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "../../config/database.php";

try {
    $db = new Database();
    $conn = $db->getConnection();

    // Get last 20 notifications
    $query = "SELECT n.*, b.immatriculation 
              FROM notification n 
              LEFT JOIN conducteur c ON n.id_user = c.id_user
              LEFT JOIN bus b ON c.matricule = b.matricule
              ORDER BY n.date_heure DESC LIMIT 20";
    
    $stmt = $conn->prepare($query);
    $stmt->execute();
    
    $notifications = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $notifications[] = [
            "id" => $row['id_notification'],
            "id_bus" => $row['id_user'],
            "bus_number" => (!empty($row['immatriculation'])) ? $row['immatriculation'] : $row['id_user'],
            "message" => $row['message'],
            "type" => $row['type'],
            "time" => date("H:i", strtotime($row['date_heure']))
        ];
    }

    echo json_encode(["status" => "success", "notifications" => $notifications]);

} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
