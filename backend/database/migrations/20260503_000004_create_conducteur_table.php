





<?php

return [
    'up' => "
        CREATE TABLE conducteur (
            matricule INT PRIMARY KEY,
            id_user INT UNIQUE,
            gps_active TINYINT(1) DEFAULT 0,
            date_ajout DATE DEFAULT (CURRENT_DATE),

            FOREIGN KEY (id_user)
                REFERENCES users(id_user)
                ON DELETE CASCADE
                ON UPDATE CASCADE
        );
    ",

    'down' => "
        DROP TABLE IF EXISTS conducteur;
    "
];