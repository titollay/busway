<?php
require_once 'backend/config/db.php';
try {
    $pdo = getDB();
    $stmt = $pdo->query("DESCRIBE users");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($columns, JSON_PRETTY_PRINT);
} catch (Exception $e) {
    echo $e->getMessage();
}
?>
