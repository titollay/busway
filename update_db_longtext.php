<?php
require_once 'backend/config/db.php';

try {
    $pdo = getDB();
    // Change image column to LONGTEXT to support large base64 strings
    $sql = "ALTER TABLE users MODIFY COLUMN image LONGTEXT DEFAULT NULL";
    $pdo->exec($sql);
    echo "Table users updated: image column is now LONGTEXT.\n";
} catch (PDOException $e) {
    echo "Error updating table: " . $e->getMessage() . "\n";
}
?>
