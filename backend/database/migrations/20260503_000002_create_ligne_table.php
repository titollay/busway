<?php

return [
    'up' => "
        CREATE TABLE ligne (
            id_ligne INT AUTO_INCREMENT PRIMARY KEY,
            nom_ligne VARCHAR(50) NULL,
            point_depart VARCHAR(50) NULL,
            point_arrivee VARCHAR(50) NULL,
            date_ajout DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    ",

    'down' => "
        DROP TABLE IF EXISTS ligne;
    "
];