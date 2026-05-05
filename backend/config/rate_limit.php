<?php

function rateLimit($key, $maxAttempts = 5, $seconds = 60): void {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    $now = time();

    if (!isset($_SESSION['rate_limit'])) {
        $_SESSION['rate_limit'] = [];
    }

    // clean old data
    foreach ($_SESSION['rate_limit'] as $k => $data) {
        if ($data['time'] < ($now - $seconds)) {
            unset($_SESSION['rate_limit'][$k]);
        }
    }

    // check current key
    if (isset($_SESSION['rate_limit'][$key])) {
        if ($_SESSION['rate_limit'][$key]['count'] >= $maxAttempts) {
            jsonError("Trop de tentatives, réessayez plus tard", 429);
        }

        $_SESSION['rate_limit'][$key]['count']++;
    } else {
        $_SESSION['rate_limit'][$key] = [
            'count' => 1,
            'time' => $now
        ];
    }
}