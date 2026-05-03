<?php

return [
    'up' => "
        CREATE TABLE ligne_arret (
            id_ligne INT NOT NULL,
            id_arret INT NOT NULL,
            ordre INT NULL,
            date_ajout DATETIME DEFAULT CURRENT_TIMESTAMP,

            PRIMARY KEY (id_ligne, id_arret),

            INDEX (id_ligne),
            INDEX (id_arret),

            FOREIGN KEY (id_ligne)
                REFERENCES ligne(id_ligne)
                ON DELETE CASCADE
                ON UPDATE CASCADE,

            FOREIGN KEY (id_arret)
                REFERENCES arret(id_arret)
                ON DELETE CASCADE
                ON UPDATE CASCADE
        );
    ",

    'down' => "
        DROP TABLE IF EXISTS ligne_arret;
    "
];