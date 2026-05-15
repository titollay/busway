<?php
// backend/api/stops/manage_arret.php
// POST   → créer un arrêt
// PUT    ?id_arret=X → modifier
// DELETE ?id_arret=X → supprimer

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/auth.php';

setCorsHeaders();
requireRole('admin');

$method = $_SERVER['REQUEST_METHOD'];
$pdo    = getDB();

// ── POST : créer ─────────────────────────────────────────
if ($method === 'POST') {
    $body      = getJsonBody();
    $nom_arret = trim($body['nom_arret'] ?? '');
    $latitude  = $body['latitude']  ?? null;
    $longitude = $body['longitude'] ?? null;

    if (!$nom_arret) {
        jsonError('nom_arret est requis');
    }

    if ($latitude !== null && $longitude !== null) {
        if (!is_numeric($latitude) || !is_numeric($longitude)) {
            jsonError('Coordonnées invalides');
        }
        $latitude  = (float) $latitude;
        $longitude = (float) $longitude;
        if ($latitude < -90 || $latitude > 90)   jsonError('Latitude invalide');
        if ($longitude < -180 || $longitude > 180) jsonError('Longitude invalide');
    }

    $stmt = $pdo->prepare("
        INSERT INTO arret (nom_arret, latitude, longitude, date_arret)
        VALUES (?, ?, ?, CURDATE())
    ");
    $stmt->execute([$nom_arret, $latitude, $longitude]);

    jsonResponse([
        'success'   => true,
        'message'   => 'Arrêt créé avec succès',
        'id_arret'  => (int) $pdo->lastInsertId(),
    ], 201);
}

// ── PUT : modifier ────────────────────────────────────────
if ($method === 'PUT') {
    $id_arret = isset($_GET['id_arret']) ? (int) $_GET['id_arret'] : null;
    if (!$id_arret) jsonError('Paramètre id_arret requis');

    $body    = getJsonBody();
    $fields  = [];
    $values  = [];
    $allowed = ['nom_arret', 'latitude', 'longitude', 'ordre'];

    foreach ($allowed as $field) {
        if (array_key_exists($field, $body)) {
            $fields[] = "$field = ?";
            $values[] = $body[$field] === '' ? null : $body[$field];
        }
    }

    if (empty($fields)) jsonError('Aucun champ à modifier');

    $values[] = $id_arret;
    $pdo->prepare("UPDATE arret SET " . implode(', ', $fields) . " WHERE id_arret = ?")
        ->execute($values);

    jsonResponse(['success' => true, 'message' => 'Arrêt mis à jour']);
}

// ── DELETE ────────────────────────────────────────────────
if ($method === 'DELETE') {
    $id_arret = isset($_GET['id_arret']) ? (int) $_GET['id_arret'] : null;
    if (!$id_arret) jsonError('Paramètre id_arret requis');

    // Supprimer d'abord les associations ligne_arret
    $pdo->prepare("DELETE FROM ligne_arret WHERE id_arret = ?")
        ->execute([$id_arret]);

    $stmt = $pdo->prepare("DELETE FROM arret WHERE id_arret = ?");
    $stmt->execute([$id_arret]);

    if ($stmt->rowCount() === 0) jsonError('Arrêt introuvable', 404);

    jsonResponse(['success' => true, 'message' => 'Arrêt supprimé']);
}

jsonError('Méthode non autorisée', 405);