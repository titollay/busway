<?php
require_once __DIR__ . '/../config/db.php';

$pdo = getDB();

// 🧺 Clear existing data (optional but cleaner for seeding)
$pdo->exec("SET FOREIGN_KEY_CHECKS = 0");
$pdo->exec("TRUNCATE TABLE users");
$pdo->exec("TRUNCATE TABLE conducteur");
$pdo->exec("TRUNCATE TABLE bus");
$pdo->exec("TRUNCATE TABLE ligne");
$pdo->exec("SET FOREIGN_KEY_CHECKS = 1");

$users = [
    ['nom' => 'Taha Allay', 'email' => 'taha@gmail.com', 'pass' => '123456', 'tel' => '0612345678', 'role' => 'user'],
    ['nom' => 'Ahmed Driver', 'email' => 'driver@gmail.com', 'pass' => '123456', 'tel' => '0622334455', 'role' => 'conducteur'],
    ['nom' => 'Admin System', 'email' => 'admin@gmail.com', 'pass' => '123456', 'tel' => '0600000000', 'role' => 'admin'],
];

echo "🌱 Seeding users...\n";

foreach ($users as $u) {
    $hash = password_hash($u['pass'], PASSWORD_BCRYPT);
    
    $stmt = $pdo->prepare("INSERT INTO users (nom, email, password, telephone, role) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$u['nom'], $u['email'], $hash, $u['tel'], $u['role']]);
    
    $id_user = $pdo->lastInsertId();
    echo "✅ Created {$u['role']}: {$u['nom']}\n";

    // If it's a driver, add to conducteur table and create a bus
    if ($u['role'] === 'conducteur') {
        $matricule = 100; // Sample matricule
        
        // 1. Add to conducteur
        $stmt2 = $pdo->prepare("INSERT INTO conducteur (matricule, id_user, gps_active) VALUES (?, ?, 1)");
        $stmt2->execute([$matricule, $id_user]);
        
        // 2. Add a sample line first
        $pdo->exec("INSERT INTO ligne (nom_ligne, point_depart, point_arrivee) VALUES ('Ligne 01 - Oujda Al-Qods', 'Al-Qods', 'Centre Ville')");
        $id_ligne = $pdo->lastInsertId();

        // 3. Add a bus assigned to this driver (matricule)
        $stmt3 = $pdo->prepare("INSERT INTO bus (immatriculation, modele, id_ligne, matricule, en_service) VALUES (?, ?, ?, ?, 1)");
        $stmt3->execute(['B-2026-WAY', 'Mercedes Citaro', $id_ligne, $matricule]);
        
        echo "   🎫 Assigned Matricule: $matricule & GPS Activated\n";
        echo "   🚌 Created Bus (B-2026-WAY) & Assigned to this driver\n";
    }
}

echo "🎉 Seeding completed!";
