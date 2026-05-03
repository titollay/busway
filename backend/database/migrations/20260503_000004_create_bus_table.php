<?php

return [
    'up' => "
        CREATE TABLE bus (
            id_bus INT AUTO_INCREMENT PRIMARY KEY,
            immatriculation VARCHAR(50) NULL,
            modele VARCHAR(100) NULL,
            capacite INT NULL,
            en_service TINYINT(1) NOT NULL DEFAULT 1,
            id_ligne INT NULL,
            matricule INT NULL,
            date_ajout DATE NULL,

            INDEX (id_ligne),
            INDEX (matricule),

            FOREIGN KEY (id_ligne)
                REFERENCES ligne(id_ligne)
                ON DELETE SET NULL
                ON UPDATE CASCADE
        );
    ",

    'down' => "
        DROP TABLE IF EXISTS bus;
    "
];