<?php
// Database Configuration
$host = "localhost";
$user = "root";
$pass = "";
$db   = "BussWay";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("❌ Connection failed: " . $conn->connect_error);
}

echo "🚀 Database Connected Successfully.\n";
echo "🚌 Super-Smooth Simulator (Version 3.1) Active...\n";

// Fetch Stops
$stops_query = "SELECT * FROM arret ORDER BY id_arret ASC";
$result = $conn->query($stops_query);
$stops = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $stops[] = $row;
    }
} else {
    die("❌ Error fetching stops: " . $conn->error);
}

if (empty($stops)) {
    die("❌ No stops found in the database. Please run seed_oujda.php first.");
}

// Routes Definition
$paths = [
    1 => array_values(array_filter($stops, fn($s) => in_array($s['id_arret'], [1,2,15,18,12,17,16,13,14]))),
    2 => array_values(array_filter($stops, fn($s) => in_array($s['id_arret'], [7,8,9,10,11]))),
    3 => array_values(array_filter($stops, fn($s) => in_array($s['id_arret'], [4,3,9,8,7]))),
    4 => array_values(array_filter($stops, fn($s) => in_array($s['id_arret'], [13,1,14,11,10])))
];

$positions_indices = [];
$micro_indices = [];
$delays = [];
$directions = [];

foreach ($paths as $busId => $bus_stops) {
    $positions_indices[$busId] = 0;
    $micro_indices[$busId] = 0;
    $delays[$busId] = 0;
    $directions[$busId] = 1;
}

$steps_per_leg = 40; 

while (true) {
    $batch = [];

    foreach ($paths as $busId => $bus_stops) {
        if (empty($bus_stops)) continue;

        if ($delays[$busId] > 0) {
            $delays[$busId]--;
            $pos_idx = $positions_indices[$busId];
            $curr = $bus_stops[$pos_idx] ?? null;
            if ($curr) {
                $batch[] = [
                    'id_bus' => $busId,
                    'latitude' => $curr['latitude'],
                    'longitude' => $curr['longitude'],
                    'nom_ligne' => "En Arrêt"
                ];
            }
            continue;
        }

        $idx = $positions_indices[$busId];
        $next_idx = $idx + $directions[$busId];

        // Bounds check
        if (!isset($bus_stops[$idx]) || !isset($bus_stops[$next_idx])) {
            $directions[$busId] *= -1;
            $delays[$busId] = 5;
            continue;
        }

        $start = $bus_stops[$idx];
        $end = $bus_stops[$next_idx];

        $progress = $micro_indices[$busId] / $steps_per_leg;
        $currentLat = $start['latitude'] + ($end['latitude'] - $start['latitude']) * $progress;
        $currentLng = $start['longitude'] + ($end['longitude'] - $start['longitude']) * $progress;

        $batch[] = [
            'id_bus' => $busId,
            'latitude' => $currentLat,
            'longitude' => $currentLng,
            'nom_ligne' => "Ligne " . $busId
        ];

        $micro_indices[$busId]++;
        
        if ($micro_indices[$busId] > $steps_per_leg) {
            $micro_indices[$busId] = 0;
            $positions_indices[$busId] = $next_idx;
            
            if ($positions_indices[$busId] >= count($bus_stops) - 1 || $positions_indices[$busId] <= 0) {
                $directions[$busId] *= -1;
                $delays[$busId] = 10;
            } else {
                $delays[$busId] = 4;
            }
        }
    }

    // Broadcast
    $ch = curl_init('http://localhost:4000/update-bus');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['fleet' => $batch]));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_exec($ch);
    curl_close($ch);

    usleep(500000); 
}
