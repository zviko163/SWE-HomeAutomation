<?php
header("Content-Type: application/json");

require_once 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Read JSON input
    $json = file_get_contents("php://input");
    $data = json_decode($json, true);

    if ($data) {
        $temperature = $data["temperature"];
        $humidity = $data["humidity"];
        $lightLevel = $data["lightLevel"];
        $motion = $data["motion"] ? 1 : 0;
        $distance = $data["distance"];
        $rain = $data["rain"] ? 1 : 0;

        // Insert data into database
        $query = "INSERT INTO daily_readings (temperature, humidity, lightLevel, motion, distance, rain) 
                  VALUES ('$temperature', '$humidity', '$lightLevel', '$motion', '$distance', '$rain')";

        if (mysqli_query($conn, $query)) {
            echo json_encode(["status" => "success", "message" => "Data inserted successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error inserting data: " . mysqli_error($conn)]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid JSON data"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
}

// Close connection
mysqli_close($conn);
?>
