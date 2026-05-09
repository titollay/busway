<?php
require_once __DIR__ . '/../config/db.php';
$pdo = getDB();

echo "🇲🇦 Seeding Oujda Bus Network Data...\n";

$pdo->exec("SET FOREIGN_KEY_CHECKS = 0");
$pdo->exec("TRUNCATE TABLE ligne_arret");
$pdo->exec("TRUNCATE TABLE arret");
$pdo->exec("TRUNCATE TABLE ligne");
$pdo->exec("SET FOREIGN_KEY_CHECKS = 1");

// 📍 1. Define Main Stops (Arrêts) in Oujda
$stops = [
    'Bab Sidi Abdelwahab' => [34.681132, -1.908027],
    'Centre-ville (Place 16 Aout)' => [34.685412, -1.912662],
    'Université Mohammed Premier' => [34.650882, -1.897402],
    'Hay El Qods' => [34.654512, -1.890632],
    'Gare Routière' => [34.697521, -1.916892],
    'Gare ONCF (Train)' => [34.688222, -1.921352],
    'Sidi Yahya' => [34.646512, -1.884521],
    'Sidi Maafa' => [34.636821, -1.927212],
    'Hay Al Farah' => [34.664512, -1.930632],
    'Hay Lazaret' => [34.690512, -1.885632],
    'Zone industrielle' => [34.708512, -1.881632]
];

$arret_ids = [];
foreach ($stops as $name => $coords) {
    $stmt = $pdo->prepare("INSERT INTO arret (nom_arret, latitude, longitude) VALUES (?, ?, ?)");
    $stmt->execute([$name, $coords[0], $coords[1]]);
    $arret_ids[$name] = $pdo->lastInsertId();
    echo "📍 Stop Created: $name\n";
}

// 🚌 2. Define Lines
$lines_data = [
    [1, 'Ligne 01: Bab Sidi Abdelwahab - Université', 'Bab Sidi Abdelwahab', 'Université Mohammed Premier'],
    [2, 'Ligne 02: Gare Routière - Sidi Yahya', 'Gare Routière', 'Sidi Yahya'],
    [3, 'Ligne 03: Sidi Maafa - Université', 'Sidi Maafa', 'Université Mohammed Premier'],
    [4, 'Ligne 04: Hay El Qods - Gare ONCF', 'Hay El Qods', 'Gare ONCF (Train)'],
    [5, 'Ligne 05: Hay Lazaret - Sidi Yahya', 'Hay Lazaret', 'Sidi Yahya'],
    [6, 'Ligne 06: Centre-ville - Zone industrielle', 'Centre-ville (Place 16 Aout)', 'Zone industrielle'],
    [7, 'Ligne 07: Université - Bab Sidi Abdelwahab', 'Université Mohammed Premier', 'Bab Sidi Abdelwahab'],
];

$ligne_ids = [];
foreach ($lines_data as $l) {
    $stmt = $pdo->prepare("INSERT INTO ligne (id_ligne, nom_ligne, point_depart, point_arrivee) VALUES (?, ?, ?, ?)");
    $stmt->execute($l);
    $ligne_ids[$l[0]] = $l[0];
    echo "🚌 Line Created: {$l[1]}\n";
}

// 🔗 3. Mapping Lines to Stops (Ligne_Arret)
$mapping = [
    1 => ['Bab Sidi Abdelwahab', 'Centre-ville (Place 16 Aout)', 'Hay El Qods', 'Université Mohammed Premier'],
    2 => ['Gare Routière', 'Centre-ville (Place 16 Aout)', 'Hay El Qods', 'Sidi Yahya'],
    3 => ['Sidi Maafa', 'Centre-ville (Place 16 Aout)', 'Hay Al Farah', 'Université Mohammed Premier'],
    4 => ['Hay El Qods', 'Centre-ville (Place 16 Aout)', 'Gare ONCF (Train)'],
    5 => ['Hay Lazaret', 'Centre-ville (Place 16 Aout)', 'Gare Routière', 'Sidi Yahya'],
    6 => ['Centre-ville (Place 16 Aout)', 'Zone industrielle'],
    7 => ['Université Mohammed Premier', 'Hay El Qods', 'Centre-ville (Place 16 Aout)', 'Bab Sidi Abdelwahab']
];

foreach ($mapping as $line_id => $stops_list) {
    $ordre = 1;
    foreach ($stops_list as $stop_name) {
        $stmt = $pdo->prepare("INSERT INTO ligne_arret (id_ligne, id_arret, ordre) VALUES (?, ?, ?)");
        $stmt->execute([$line_id, $arret_ids[$stop_name], $ordre]);
        $ordre++;
    }
    echo "🔗 Linked " . count($stops_list) . " stops to Line $line_id\n";
}

// 🚌 Ensure our test bus is on Ligne 1
$pdo->exec("UPDATE bus SET id_ligne = 1 WHERE matricule = 100");

echo "🎉 Oujda Network Seeding completed!";
