<?php
// backend/api/lines/get_lignes.php
// GET /           → toutes les lignes
// GET ?id_ligne=X → une ligne avec ses arrêts et bus

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonError('Méthode non autorisée', 405);
}

$pdo      = getDB();
$id_ligne = isset($_GET['id_ligne']) ? (int) $_GET['id_ligne'] : null;

// ── Détail d'une ligne ───────────────────────────────────
if ($id_ligne) {
    $stmt = $pdo->prepare("SELECT * FROM ligne WHERE id_ligne = ?");
    $stmt->execute([$id_ligne]);
    $ligne = $stmt->fetch();

    if (!$ligne) jsonError('Ligne introuvable', 404);

    // Arrêts ordonnés
    $stmt = $pdo->prepare("
        SELECT a.id_arret, a.nom_arret, a.latitude, a.longitude, la.ordre
        FROM arret a
        JOIN ligne_arret la ON la.id_arret = a.id_arret
        WHERE la.id_ligne = ?
        ORDER BY la.ordre
    ");
    $stmt->execute([$id_ligne]);
    $arrets = $stmt->fetchAll();

    // Bus actifs sur la ligne
    $stmt = $pdo->prepare("
        SELECT id_bus, immatriculation, modele, capacite
        FROM bus
        WHERE id_ligne = ? AND en_service = 1
    ");
    $stmt->execute([$id_ligne]);
    $bus = $stmt->fetchAll();

    jsonResponse([
        'ligne'  => $ligne,
        'arrets' => $arrets,
        'bus'    => $bus,
    ]);
    return;
}

// ── Liste de toutes les lignes ───────────────────────────
$lignes = $pdo->query("
    SELECT 
        l.*,
        COUNT(DISTINCT b.id_bus) AS nb_bus,
        COUNT(DISTINCT la.id_arret) AS nb_arrets
    FROM ligne l
    LEFT JOIN bus b  ON b.id_ligne  = l.id_ligne AND b.en_service = 1
    LEFT JOIN ligne_arret la ON la.id_ligne = l.id_ligne
    GROUP BY l.id_ligne
    ORDER BY l.nom_ligne
")->fetchAll();

jsonResponse([
    'lignes' => $lignes,
    'total'  => count($lignes),
]);
