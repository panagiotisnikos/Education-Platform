<?php
include_once 'db.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

header("Content-Type: application/json");

if (!isset($_GET["training_plan_id"])) {
    echo json_encode(["success" => false, "error" => "Missing training_plan_id"]);
    exit;
}

$trainingPlanId = $_GET["training_plan_id"];

try {
    $stmt = $pdo->prepare("SELECT id, title, content FROM sections WHERE training_plan_id = :training_plan_id");
    $stmt->bindParam(':training_plan_id', $trainingPlanId, PDO::PARAM_INT);
    $stmt->execute();
    
    $sections = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode(["success" => true, "sections" => $sections]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>


