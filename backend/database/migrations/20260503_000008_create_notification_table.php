<?php

return [
    'up' => "
        CREATE TABLE notification (
            id_notification INT AUTO_INCREMENT PRIMARY KEY,
            message VARCHAR(500) NULL,
            date_heure DATETIME DEFAULT CURRENT_TIMESTAMP,
            lu TINYINT(1) DEFAULT 0,
            id_user INT NULL,

            INDEX (id_user),

            FOREIGN KEY (id_user)
                REFERENCES user(id_user)
                ON DELETE CASCADE
                ON UPDATE CASCADE
        );
    ",

    'down' => "
        DROP TABLE IF EXISTS notification;
    "
];