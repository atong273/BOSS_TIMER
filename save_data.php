<?php
// Get the JSON data from the request
$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData, true);

// Save to file
$file = 'boss_data.json';
$result = file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT));

if ($result === false) {
    echo json_encode(['success' => false, 'message' => 'Failed to save data']);
} else {
    echo json_encode(['success' => true]);
}
?>