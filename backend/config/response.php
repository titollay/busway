<?php

function jsonResponse($message = "OK", $data = [], $status = 200): never {
    http_response_code($status);

    echo json_encode([
        "success" => true,
        "message" => $message,
        "data" => $data
    ]);

    exit;
}

function jsonError($message = "Error", $status = 400): never {
    http_response_code($status);

    echo json_encode([
        "success" => false,
        "message" => $message
    ]);

    exit;
}