<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/cors.php';

setCorsHeaders();
$pdo = getDB();

$id_bus = $_GET['id_bus'] ?? null;
$user_lat = $_GET['lat'] ?? null;
$user_lng = $_GET['lng'] ?? null;

if (!$id_bus || !$user_lat || !$user_lng) {
    jsonError("Paramètres manquants");
}

function distance($lat1, $lon1, $lat2, $lon2) {
    $R = 6371;
    $dLat = deg2rad($lat2 - $lat1);
    $dLon = deg2rad($lon2 - $lon1);

    $a = sin($dLat/2)**2 +
         cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
         sin($dLon/2)**2;

    return $R * 2 * atan2(sqrt($a), sqrt(1-$a));
}

// آخر جوج positions
$stmt = $pdo->prepare("
    SELECT latitude, longitude, horodatage
    FROM bus_position
    WHERE id_bus = ?
    ORDER BY horodatage DESC
    LIMIT 2
");
$stmt->execute([$id_bus]);
$positions = $stmt->fetchAll();

if (!$positions) jsonError("Bus introuvable");

$bus = $positions[0];
$speed = 30;

// speed dynamique
if (count($positions) == 2) {
    $p1 = $positions[0];
    $p2 = $positions[1];

    $distanceKm = distance($p1['latitude'], $p1['longitude'], $p2['latitude'], $p2['longitude']);
    $timeHours = abs(strtotime($p1['horodatage']) - strtotime($p2['horodatage'])) / 3600;

    if ($timeHours > 0) {
        $speed = $distanceKm / $timeHours;
    }
}

$distance = distance($user_lat, $user_lng, $bus['latitude'], $bus['longitude']);
$eta = ($distance / max($speed, 1)) * 60;

jsonResponse([
    'distance_km' => round($distance, 2),
    'eta_minutes' => round($eta),
    'speed_kmh'   => round($speed, 2)
]);