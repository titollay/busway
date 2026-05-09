<?php
require_once __DIR__ . '/../config/db.php';
$pdo = getDB();

echo "📊 Checking Data Consistency...\n";

echo "\n--- Users ---\n";
$users = $pdo->query("SELECT id_user, nom, role FROM users")->fetchAll();
print_r($users);

echo "\n--- Conducteurs ---\n";
$drivers = $pdo->query("SELECT matricule, id_user, gps_active FROM conducteur")->fetchAll();
print_r($drivers);

echo "\n--- Buses ---\n";
$buses = $pdo->query("SELECT id_bus, matricule, immatriculation FROM bus")->fetchAll();
print_r($buses);
