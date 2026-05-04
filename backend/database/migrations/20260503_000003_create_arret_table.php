
<?php

return [
    'up' => "
        CREATE TABLE arret (
            id_arret INT AUTO_INCREMENT PRIMARY KEY,
            nom_arret VARCHAR(100) NULL,
            latitude DECIMAL(9,6) NULL,
            longitude DECIMAL(9,6) NULL,
            ordre INT NULL,
            date_arret DATE NULL
        );
    ",

    'down' => "
        DROP TABLE IF EXISTS arret;
    "
];