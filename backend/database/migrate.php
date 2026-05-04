<?php

require_once __DIR__ . "/../config/db.php";

$db = getDB();

$files = glob(__DIR__ . "/migrations/*.php");
sort($files);

echo "🚀 Starting migrations...\n";

foreach ($files as $file) {
    echo "Running: " . basename($file) . "\n";

    $migration = require $file;

    try {
        $db->exec($migration['up']);
        echo "✅ Success\n";
    } catch (PDOException $e) {
        echo "❌ Error: " . $e->getMessage() . "\n";
        exit;
    }
}

echo "🎉 All migrations completed!";