<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../../config/db.php';

try {
    $pdo = getDB();

    $page  = max(1, intval($_GET['page']  ?? 1));
    $limit = max(1, min(50, intval($_GET['limit'] ?? 10)));
    $offset = ($page - 1) * $limit;

    // Total count for pagination meta
    $totalStmt = $pdo->query("SELECT COUNT(*) FROM notification");
    $total = (int) $totalStmt->fetchColumn();
    $totalPages = (int) ceil($total / $limit);

    $sql = "SELECT n.*, u.nom as driver_name 
            FROM notification n 
            LEFT JOIN users u ON n.id_user = u.id_user 
            ORDER BY n.date_heure DESC
            LIMIT :limit OFFSET :offset";

    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':limit',  $limit,  PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status"      => "success",
        "success"     => true,
        "data"        => $notifications,
        "pagination"  => [
            "page"        => $page,
            "limit"       => $limit,
            "total"       => $total,
            "totalPages"  => $totalPages,
            "hasNext"     => $page < $totalPages,
            "hasPrev"     => $page > 1,
        ]
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status"  => "error",
        "success" => false,
        "message" => "Base de données: " . $e->getMessage()
    ]);
}
?>
