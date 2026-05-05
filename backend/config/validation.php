<?php

function validateGPS($lat, $lng): void {
    if (!is_numeric($lat) || !is_numeric($lng)) {
        jsonError("Coordonnées invalides");
    }

    $lat = (float) $lat;
    $lng = (float) $lng;

    if ($lat < -90 || $lat > 90) {
        jsonError("Latitude invalide");
    }

    if ($lng < -180 || $lng > 180) {
        jsonError("Longitude invalide");
    }
}