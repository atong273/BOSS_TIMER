<?php
$file = 'boss_data.json';

if (file_exists($file)) {
    // Read and return the JSON data
    header('Content-Type: application/json');
    readfile($file);
} else {
    // Return empty data structure if file doesn't exist
    header('Content-Type: application/json');
    echo json_encode([
        'bossData' => new stdClass(),
        'fixedBossData' => new stdClass()
    ]);
}
?>