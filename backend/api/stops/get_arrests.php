<?php
// backend/api/stops/get_arrests.php
// GET /              → tous les arrêts
// GET ?id_arret=X   → un arrêt avec ses lignes
// GET ?near=lat,lng&radius=500  → arrêts proches (GPS)

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonError('Méthode non autorisée', 405);
}

$pdo      = getDB();
$id_arret = isset($_GET['id_arret']) ? (int) $_GET['id_arret'] : null;

// ── Détail d'un arrêt ────────────────────────────────────
if ($id_arret) {
    $stmt = $pdo->prepare("SELECT * FROM arret WHERE id_arret = ?");
    $stmt->execute([$id_arret]);
    $arret = $stmt->fetch();

    if (!$arret) jsonError('Arrêt introuvable', 404);

    // Lignes qui passent par cet arrêt
    $stmt = $pdo->prepare("
        SELECT l.id_ligne, l.nom_ligne, l.point_depart, l.point_arrivee, la.ordre
        FROM ligne l
        JOIN ligne_arret la ON la.id_ligne = l.id_ligne
        WHERE la.id_arret = ?
        ORDER BY l.nom_ligne
    ");
    $stmt->execute([$id_arret]);
    $lignes = $stmt->fetchAll();

    jsonResponse(['arret' => $arret, 'lignes' => $lignes]);
    return;
}

// ── Arrêts proches (Haversine) ───────────────────────────
if (!empty($_GET['near'])) {
    $coords = explode(',', $_GET['near']);
    if (count($coords) !== 2) jsonError('Format: ?near=lat,lng');

    $lat    = (float) $coords[0];
    $lng    = (float) $coords[1];
    $radius = (int) ($_GET['radius'] ?? 500);

    $stmt = $pdo->prepare("
        SELECT *,
            ROUND(
                6371000 * ACOS(
                    COS(RADIANS(?)) * COS(RADIANS(latitude))
                    * COS(RADIANS(longitude) - RADIANS(?))
                    + SIN(RADIANS(?)) * SIN(RADIANS(latitude))
                )
            , 0) AS distance_metres
        FROM arret
        WHERE latitude IS NOT NULL AND longitude IS NOT NULL
        HAVING distance_metres <= ?
        ORDER BY distance_metres
        LIMIT 10
    ");
    $stmt->execute([$lat, $lng, $lat, $radius]);
    $arrets = $stmt->fetchAll();

    jsonResponse([
        'arrets'         => $arrets,
        'total'          => count($arrets),
        'centre'         => ['lat' => $lat, 'lng' => $lng],
        'rayon_metres'   => $radius,
    ]);
    return;
}

// ── Tous les arrêts ──────────────────────────────────────
$arrets = $pdo->query("SELECT * FROM arret ORDER BY nom_arret")->fetchAll();

jsonResponse([
    'arrets' => $arrets,
    'total'  => count($arrets),
]);
