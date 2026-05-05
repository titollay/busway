<?php

function setCorsHeaders(): void {
    header("Access-Control-Allow-Origin: http://localhost:3000");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Content-Type: application/json");

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

function jsonResponse($data, $status = 200): never {
    http_response_code($status);
    echo json_encode($data);
    exit;
}

function jsonError($message, $status = 400): never {
    jsonResponse([
        'success' => false,
        'message' => $message
    ], $status);
}

function getJsonBody(): array {
    return json_decode(file_get_contents("php://input"), true) ?? [];
}