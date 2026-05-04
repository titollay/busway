<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/auth.php';

setCorsHeaders();

// ✔️ فقط conducteur أو admin
$payload = requireRole('conducteur', 'admin');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError("Méthode non autorisée", 405);
}

$pdo = getDB();
$body = getJsonBody();

$id_bus = isset($body['id_bus']) ? (int)$body['id_bus'] : null;
$latitude = isset($body['latitude']) ? (float)$body['latitude'] : null;
$longitude = isset($body['longitude']) ? (float)$body['longitude'] : null;

if (!$id_bus || $latitude === null || $longitude === null) {
    jsonError("id_bus, latitude et longitude sont requis");
}

// ✔️ vérifier coordonnées
if ($latitude < -90 || $latitude > 90 || $longitude < -180 || $longitude > 180) {
    jsonError("Coordonnées invalides");
}

// ✔️ vérifier bus
$stmt = $pdo->prepare("SELECT id_bus, matricule FROM bus WHERE id_bus = ? AND en_service = 1");
$stmt->execute([$id_bus]);
$bus = $stmt->fetch();

if (!$bus) {
    jsonError("Bus introuvable ou hors service", 404);
}

// ✔️ conducteur يقدر غير bus ديالو
if ($payload['role'] === 'conducteur') {
    if (($payload['matricule'] ?? null) != $bus['matricule']) {
        jsonError("Vous n'êtes pas assigné à ce bus", 403);
    }
}

// ✔️ insert position
$stmt = $pdo->prepare("
    INSERT INTO bus_position (latitude, longitude, horodatage, id_bus)
    VALUES (?, ?, NOW(), ?)
");
$stmt->execute([$latitude, $longitude, $id_bus]);

// ✔️ تحديث gps_active
if (!empty($payload['matricule'])) {
    $pdo->prepare("
        UPDATE conducteur SET gps_active = 1 WHERE matricule = ?
    ")->execute([$payload['matricule']]);
}

//////////////////////////////////////////////////////
// 🔔 NOTIFICATIONS (VERSION صحيحة و قوية)
//////////////////////////////////////////////////////

// ✔️ نجيب users لي عندهم GPS (خاصك تضيف lat/lng ف users أو table أخرى)
$stmt = $pdo->prepare("
    SELECT id_user, latitude, longitude
    FROM users
    WHERE role = 'user'
      AND latitude IS NOT NULL
      AND longitude IS NOT NULL
");
$stmt->execute();
$users = $stmt->fetchAll();

// ✔️ function distance Haversine
function calcDistance($lat1, $lon1, $lat2, $lon2) {
    $R = 6371; // km
    $dLat = deg2rad($lat2 - $lat1);
    $dLon = deg2rad($lon2 - $lon1);

    $a = sin($dLat/2) * sin($dLat/2) +
         cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
         sin($dLon/2) * sin($dLon/2);

    return $R * 2 * atan2(sqrt($a), sqrt(1-$a));
}

foreach ($users as $u) {

    $dist = calcDistance($latitude, $longitude, $u['latitude'], $u['longitude']);

    // ✔️ أقل من 0.5 km
    if ($dist < 0.5) {

        // ✔️ تجنب spam (ما تبعثش نفس notif بزاف)
        $check = $pdo->prepare("
            SELECT id_notification 
            FROM notification 
            WHERE id_user = ? 
              AND type = 'bus_approche'
              AND TIMESTAMPDIFF(MINUTE, date_heure, NOW()) < 5
        ");
        $check->execute([$u['id_user']]);

        if (!$check->fetch()) {

            $pdo->prepare("
                INSERT INTO notification (message, type, id_user)
                VALUES (?, 'bus_approche', ?)
            ")->execute([
                "🚌 Bus قريب منك (أقل من 500m)",
                $u['id_user']
            ]);
        }
    }
}

//////////////////////////////////////////////////////

jsonResponse([
    'success' => true,
    'message' => 'Position mise à jour',
    'data' => [
        'id_bus' => $id_bus,
        'latitude' => $latitude,
        'longitude' => $longitude,
        'timestamp' => date('Y-m-d H:i:s')
    ]
], 201);