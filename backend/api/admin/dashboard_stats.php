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

    // 6. Total Passengers (Example: count of 'usager')
    // Fallback if role='usager' doesn't exist, we just query total users who are not drivers/admins.
    $stmt = $pdo->query("SELECT COUNT(*) FROM users WHERE role = 'usager'");
    $todayPassengers = (int) $stmt->fetchColumn();

    // 7. Monthly Chart Data (Last 6 months)
    $months = [];
    $usagersData = [];
    $conducteursData = [];
    
    // Translate EN months to FR roughly if wanted, or just standard Y-m format
    for ($i = 5; $i >= 0; $i--) {
        // e.g., "Janv.", "Févr.", etc.
        $m = date('n', strtotime("-$i months"));
        $frenchMonths = ["", "Janv", "Févr", "Mars", "Avr", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"];
        $monthLabel = $frenchMonths[$m];
        $months[] = $monthLabel;
        
        $start = date('Y-m-01 00:00:00', strtotime("-$i months"));
        $end = date('Y-m-t 23:59:59', strtotime("-$i months"));
        
        $stmtChart1 = $pdo->prepare("SELECT COUNT(*) FROM users WHERE role IN ('user', 'usager') AND date_ajout BETWEEN ? AND ?");
        $stmtChart1->execute([$start, $end]);
        $usagersData[] = (int)$stmtChart1->fetchColumn();
        
        $stmtChart2 = $pdo->prepare("SELECT COUNT(*) FROM users WHERE role = 'conducteur' AND date_ajout BETWEEN ? AND ?");
        $stmtChart2->execute([$start, $end]);
        $conducteursData[] = (int)$stmtChart2->fetchColumn();
    }

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
        ],
        "chart" => [
            "categories" => $months,
            "series" => [
                [
                    "name" => "Usagers",
                    "data" => $usagersData
                ],
                [
                    "name" => "Conducteurs",
                    "data" => $conducteursData
                ]
            ]
        ]
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error.", "error" => $e->getMessage()]);
}
