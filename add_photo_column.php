<?php
require_once 'backend/config/db.php';

try {
    $pdo = getDB();
    $sql = "ALTER TABLE conducteur ADD COLUMN IF NOT EXISTS photo LONGTEXT DEFAULT NULL";
    $pdo->exec($sql);
    echo "Succès : Colonne 'photo' ajoutée au tableau 'conducteur'.\n";
} catch (PDOException $e) {
    echo "Erreur : " . $e->getMessage() . "\n";
}
?>
