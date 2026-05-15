<?php
// backend/api/admin/dashboard_stats.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle Preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../../config/db.php';

try {
    $pdo = getDB();

    // 1. Total Buses
    $stmt = $pdo->query("SELECT COUNT(*) FROM bus");
    $totalBuses = (int) $stmt->fetchColumn();

    // 2. Active Buses (Drivers currently tracking)
    $stmt = $pdo->query("SELECT COUNT(*) FROM conducteur WHERE gps_active = 1");
    $activeBuses = (int) $stmt->fetchColumn();

    // 3. Total Lines
    $stmt = $pdo->query("SELECT COUNT(*) FROM ligne");
    $totalLines = (int) $stmt->fetchColumn();

    // 4. Total Stops
    $stmt = $pdo->query("SELECT COUNT(*) FROM arret");
    $totalStops = (int) $stmt->fetchColumn();

    // 5. Total Drivers
    $stmt = $pdo->query("SELECT COUNT(*) FROM conducteur");
    $activeDrivers = (int) $stmt->fetchColumn();

    // 6. Total Passengers
    $stmt = $pdo->query("SELECT COUNT(*) FROM users WHERE role = 'user'");
    $todayPassengers = (int) $stmt->fetchColumn();

    // Return Data
    echo json_encode([
        "success" => true,
        "stats" => [
            "totalBuses" => $totalBuses,
            "activeBuses" => $activeBuses,
            "totalLines" => $totalLines,
            "totalStops" => $totalStops,
            "activeDrivers" => $activeDrivers,
            "todayPassengers" => $todayPassengers,
            "growth" => "+14%" // Mocked trend
        ]
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error.", "error" => $e->getMessage()]);
}
