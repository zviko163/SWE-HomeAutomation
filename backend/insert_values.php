<?php
// insert_values.php

// Database connection
$host = "localhost";
$user = "root"; // Change if necessary
$password = ""; // Change if necessary
$dbname = "smart_home_db";

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Read JSON input
$data = json_decode(file_get_contents("php://input"), true);

// Validate required data
if ($data) {
    $temperature = $data["temperature"];
    $humidity = $data["humidity"];
    $lightLevel = $data["lightLevel"];
    $motion = $data["motion"];
    $distance = $data["distance"];
    $rain = $data["rain"];
    $power = isset($data["power_consumption"]) ? $data["power_consumption"] : NULL;
    $source = isset($data["source_device"]) ? $data["source_device"] : "ESP32-1";

    $stmt = $conn->prepare("INSERT INTO sensor_data (temperature, humidity, light_level, motion_detected, distance, raining, power_consumption, source_device)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ddididds", $temperature, $humidity, $lightLevel, $motion, $distance, $rain, $power, $source);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Data inserted successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Insertion failed"]);
    }

    $stmt->close();
} else {
    echo json_encode(["status" => "error", "message" => "Invalid JSON input"]);
}

$conn->close();
?>
