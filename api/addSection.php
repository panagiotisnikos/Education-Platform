<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
include_once 'db.php';

header("Content-Type: application/json");

// debuging
$input_data = file_get_contents("php://input");
$data = json_decode($input_data, true);

if (!$data) {
    echo json_encode(["success" => false, "error" => "Invalid JSON received", "received" => $input_data]);
    exit;
}

if (!isset($data["training_plan_id"], $data["title"], $data["content"])) {
    echo json_encode(["success" => false, "error" => "Missing required fields", "received" => $data]);
    exit;
}

$trainingPlanId = $data["training_plan_id"];
$title = $data["title"];
$content = $data["content"];

try {
    $stmt = $pdo->prepare("INSERT INTO sections (training_plan_id, title, content) VALUES (:training_plan_id, :title, :content)");
    $stmt->bindParam(':training_plan_id', $trainingPlanId, PDO::PARAM_INT);
    $stmt->bindParam(':title', $title, PDO::PARAM_STR);
    $stmt->bindParam(':content', $content, PDO::PARAM_STR);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Section added successfully"]);
    } else {
        echo json_encode(["success" => false, "error" => "Failed to add section"]);
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>



