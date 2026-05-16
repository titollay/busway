<?php
require_once 'backend/config/db.php';
try {
    $pdo = getDB();
    $result = $pdo->exec("ALTER TABLE users ADD COLUMN image VARCHAR(255) DEFAULT NULL");
    echo "SUCCESS: Column 'image' added to 'users' table or already exists.";
} catch (PDOException $e) {
    if (strpos($e->getMessage(), "Duplicate column name") !== false) {
        echo "INFO: Column 'image' already exists.";
    } else {
        echo "ERROR: " . $e->getMessage();
    }
}
?>
