<?php
require_once 'backend/config/db.php';

try {
    $pdo = getDB();
    
    // Check if table users exists
    $pdo->exec("ALTER TABLE users ADD COLUMN IF NOT EXISTS photo LONGTEXT DEFAULT NULL");
    
    echo "Succès : Colonne 'photo' ajoutée au tableau 'users'.\n";
} catch (PDOException $e) {
    echo "Erreur : " . $e->getMessage() . "\n";
}
?>
