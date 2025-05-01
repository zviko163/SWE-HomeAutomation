<?php
// retrieve_values.php

// $host = "localhost";
// $user = "root"; 
// $password = ""; 
// $dbname = "smart_home_db";

$host = 'sql311.infinityfree.com'; 
$user = 'if0_38545772';        
$password = 'Theswink163';          
$dbname = 'if0_38545772_swe_project'; 

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed"]));
}

$sql = "SELECT * FROM sensor_data ORDER BY timestamp DESC LIMIT 10";
$result = $conn->query($sql);

$data = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode(["status" => "success", "data" => $data]);
} else {
    echo json_encode(["status" => "success", "data" => []]);
}

$conn->close();
?>
