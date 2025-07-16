<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
include_once __DIR__ . "/db.php";
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->training_plan_id) || !isset($data->user_id) || !isset($data->rating)) {
    echo json_encode(["success" => false, "error" => "Missing required fields"]);
    exit;
}

$training_plan_id = $data->training_plan_id;
$user_id = $data->user_id;
$rating = $data->rating;

$query = "INSERT INTO ratings (training_plan_id, user_id, rating) VALUES (?, ?, ?)
          ON DUPLICATE KEY UPDATE rating = VALUES(rating)";

$stmt = $pdo->prepare($query);
$result = $stmt->execute([$training_plan_id, $user_id, $rating]);

if ($result) {
    echo json_encode(["success" => true, "message" => "Rating saved successfully"]);
} else {
    echo json_encode(["success" => false, "error" => "Database error"]);
}
?>