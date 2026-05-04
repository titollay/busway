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

// آخر position
$stmt = $pdo->prepare("
    SELECT latitude, longitude
    FROM bus_position
    WHERE id_bus = ?
    ORDER BY horodatage DESC
    LIMIT 1
");
$stmt->execute([$id_bus]);
$bus = $stmt->fetch();

if (!$bus) jsonError("Bus introuvable");

// distance (Haversine)
function distance($lat1, $lon1, $lat2, $lon2) {
    $R = 6371;
    $dLat = deg2rad($lat2 - $lat1);
    $dLon = deg2rad($lon2 - $lon1);

    $a = sin($dLat/2) * sin($dLat/2) +
         cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
         sin($dLon/2) * sin($dLon/2);

    return $R * 2 * atan2(sqrt($a), sqrt(1-$a));
}

$distance = distance($user_lat, $user_lng, $bus['latitude'], $bus['longitude']);

// سرعة تقريبية
$speed = 30; // km/h
$eta = ($distance / $speed) * 60;

jsonResponse([
    'success' => true,
    'data' => [
        'distance_km' => round($distance, 2),
        'eta_minutes' => round($eta)
    ]
]);