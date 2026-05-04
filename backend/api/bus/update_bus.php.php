<?php
// backend/api/bus/update_bus.php
// Admin : créer ou modifier un bus
// POST  → créer
// PUT   → modifier  ?id_bus=X

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/auth.php';

setCorsHeaders();

requireRole('admin');

$method = $_SERVER['REQUEST_METHOD'];
$pdo    = getDB();

// ── POST : créer un bus ──────────────────────────────────
if ($method === 'POST') {
    $body            = getJsonBody();
    $immatriculation = trim($body['immatriculation'] ?? '');
    $modele          = trim($body['modele'] ?? '');
    $capacite        = (int) ($body['capacite'] ?? 0);
    $id_ligne        = !empty($body['id_ligne'])  ? (int) $body['id_ligne']  : null;
    $matricule       = !empty($body['matricule']) ? (int) $body['matricule'] : null;

    if (!$immatriculation || !$modele || !$capacite) {
        jsonError('immatriculation, modele et capacite sont requis');
    }

    $stmt = $pdo->prepare("
        INSERT INTO bus (immatriculation, modele, capacite, en_service, id_ligne, matricule, date_ajout)
        VALUES (?, ?, ?, 1, ?, ?, CURDATE())
    ");
    $stmt->execute([$immatriculation, $modele, $capacite, $id_ligne, $matricule]);

    jsonResponse([
        'message' => 'Bus créé avec succès',
        'id_bus'  => (int) $pdo->lastInsertId(),
    ], 201);
}

// ── PUT : modifier un bus ────────────────────────────────
if ($method === 'PUT') {
    $id_bus = isset($_GET['id_bus']) ? (int) $_GET['id_bus'] : null;
    if (!$id_bus) jsonError('Paramètre id_bus requis');

    $body    = getJsonBody();
    $fields  = [];
    $values  = [];

    $allowed = ['immatriculation', 'modele', 'capacite', 'en_service', 'id_ligne', 'matricule'];
    foreach ($allowed as $field) {
        if (array_key_exists($field, $body)) {
            $fields[] = "$field = ?";
            $values[] = $body[$field] === '' ? null : $body[$field];
        }
    }

    if (empty($fields)) jsonError('Aucun champ à modifier');

    $values[] = $id_bus;
    $pdo->prepare("UPDATE bus SET " . implode(', ', $fields) . " WHERE id_bus = ?")->execute($values);

    jsonResponse(['message' => 'Bus mis à jour']);
}

// ── DELETE ───────────────────────────────────────────────
if ($method === 'DELETE') {
    $id_bus = isset($_GET['id_bus']) ? (int) $_GET['id_bus'] : null;
    if (!$id_bus) jsonError('Paramètre id_bus requis');

    $stmt = $pdo->prepare("DELETE FROM bus WHERE id_bus = ?");
    $stmt->execute([$id_bus]);

    if ($stmt->rowCount() === 0) jsonError('Bus introuvable', 404);

    jsonResponse(['message' => 'Bus supprimé']);
}

jsonError('Méthode non autorisée', 405);
