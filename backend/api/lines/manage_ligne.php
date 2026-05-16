<?php
// backend/api/lines/manage_ligne.php
// POST   → créer une ligne
// PUT    ?id_ligne=X → modifier
// DELETE ?id_ligne=X → supprimer

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/auth.php';

setCorsHeaders();
requireRole('admin');

$method = $_SERVER['REQUEST_METHOD'];
$pdo    = getDB();

// ── POST : créer ─────────────────────────────────────────
if ($method === 'POST') {
    $body         = getJsonBody();
    $nom_ligne    = trim($body['nom_ligne']    ?? '');
    $point_depart = trim($body['point_depart'] ?? '');
    $point_arrivee= trim($body['point_arrivee']?? '');

    if (!$nom_ligne || !$point_depart || !$point_arrivee) {
        jsonError('nom_ligne, point_depart et point_arrivee sont requis');
    }

    $stmt = $pdo->prepare("
        INSERT INTO ligne (nom_ligne, point_depart, point_arrivee, date_ajout)
        VALUES (?, ?, ?, NOW())
    ");
    $stmt->execute([$nom_ligne, $point_depart, $point_arrivee]);

    jsonResponse([
        'success' => true,
        'message' => 'Ligne créée avec succès',
        'id_ligne' => (int) $pdo->lastInsertId(),
    ], 201);
}

// ── PUT : modifier ────────────────────────────────────────
if ($method === 'PUT') {
    $id_ligne = isset($_GET['id_ligne']) ? (int) $_GET['id_ligne'] : null;
    if (!$id_ligne) jsonError('Paramètre id_ligne requis');

    $body    = getJsonBody();
    $fields  = [];
    $values  = [];
    $allowed = ['nom_ligne', 'point_depart', 'point_arrivee'];

    foreach ($allowed as $field) {
        if (array_key_exists($field, $body)) {
            $fields[] = "$field = ?";
            $values[] = trim($body[$field]);
        }
    }

    if (empty($fields)) jsonError('Aucun champ à modifier');

    $values[] = $id_ligne;
    $pdo->prepare("UPDATE ligne SET " . implode(', ', $fields) . " WHERE id_ligne = ?")
        ->execute($values);

    jsonResponse(['success' => true, 'message' => 'Ligne mise à jour']);
}

// ── DELETE ────────────────────────────────────────────────
if ($method === 'DELETE') {
    $id_ligne = isset($_GET['id_ligne']) ? (int) $_GET['id_ligne'] : null;
    if (!$id_ligne) jsonError('Paramètre id_ligne requis');

    $stmt = $pdo->prepare("DELETE FROM ligne WHERE id_ligne = ?");
    $stmt->execute([$id_ligne]);

    if ($stmt->rowCount() === 0) jsonError('Ligne introuvable', 404);

    jsonResponse(['success' => true, 'message' => 'Ligne supprimée']);
}

jsonError('Méthode non autorisée', 405);