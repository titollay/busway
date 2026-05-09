<?php
require_once __DIR__ . '/../config/db.php';
$pdo = getDB();
$stmt = $pdo->query("SELECT id_user, nom, email, role FROM users");
print_r($stmt->fetchAll());
