
<?php

return [
    'up' => "
        CREATE TABLE users (
            id_user INT AUTO_INCREMENT PRIMARY KEY,
            nom VARCHAR(50) NULL,
            email VARCHAR(50) NOT NULL UNIQUE,
            password VARCHAR(200) NOT NULL,
            telephone VARCHAR(20) NULL,
            role ENUM('admin', 'user', 'conducteur') DEFAULT 'user',
            date_ajout DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    ",

    'down' => "
        DROP TABLE IF EXISTS users;
    "
];