<?php

return [
    'up' => "
        CREATE TABLE bus_position (
            id_position INT AUTO_INCREMENT PRIMARY KEY,
            latitude DECIMAL(9,6) NULL,
            longitude DECIMAL(9,6) NULL,
            horodatage DATETIME DEFAULT CURRENT_TIMESTAMP,
            date_position DATE NOT NULL DEFAULT (CURRENT_DATE),
            id_bus INT NULL,

            INDEX (id_bus),

            FOREIGN KEY (id_bus)
                REFERENCES bus(id_bus)
                ON DELETE CASCADE
                ON UPDATE CASCADE
        );
    ",

    'down' => "
        DROP TABLE IF EXISTS bus_position;
    "
];