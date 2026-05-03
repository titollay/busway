<?php

return [
    'up' => "
        CREATE TABLE conducteur (
            matricule INT PRIMARY KEY,
            gps_active TINYINT(1) DEFAULT 0,
            date_ajout DATE DEFAULT (CURRENT_DATE)
        );
    ",

    'down' => "
        DROP TABLE IF EXISTS conducteur;
    "
];