<?php
require_once __DIR__ . '/../../config/db.php';

$pdo = getDB();

// 👥 users
$users = $pdo->query("
    SELECT id_user, latitude, longitude 
    FROM users 
    WHERE latitude IS NOT NULL AND longitude IS NOT NULL
")->fetchAll();

// 🚌 buses last positions
$buses = $pdo->query("
    SELECT b.id_bus, bp.latitude, bp.longitude
    FROM bus b
    JOIN bus_position bp ON bp.id_bus = b.id_bus
    WHERE bp.latitude IS NOT NULL AND bp.longitude IS NOT NULL
    ORDER BY bp.horodatage DESC
")->fetchAll();

function distance($lat1, $lon1, $lat2, $lon2) {
    $R = 6371;
    $dLat = deg2rad($lat2 - $lat1);
    $dLon = deg2rad($lon2 - $lon1);

    $a = sin($dLat/2) * sin($dLat/2) +
         cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
         sin($dLon/2) * sin($dLon/2);

    return $R * 2 * atan2(sqrt($a), sqrt(1-$a));
}

foreach ($users as $u) {

    foreach ($buses as $b) {

        $dist = distance(
            $u['latitude'],
            $u['longitude'],
            $b['latitude'],
            $b['longitude']
        );

        // 📍 500 meters = 0.5 km
        if ($dist < 0.5) {

            $message = "🚌 Bus قريب منك";

            // 🔍 ANTI DUPLICATE (1 minute rule)
            $stmt = $pdo->prepare("
                SELECT id_notification 
                FROM notification 
                WHERE id_user = ? 
                AND message = ? 
                AND date_heure > NOW() - INTERVAL 1 MINUTE
            ");

            $stmt->execute([
                $u['id_user'],
                $message
            ]);

            $exists = $stmt->fetch();

            // 💾 insert only if not exists
            if (!$exists) {
                $stmt = $pdo->prepare("
                    INSERT INTO notification (message, date_heure, lu, id_user)
                    VALUES (?, NOW(), 0, ?)
                ");

                $stmt->execute([
                    $message,
                    $u['id_user']
                ]);
            }
        }
    }
}