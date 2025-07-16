<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
header("Content-Type: application/json; charset=UTF-8");
include_once __DIR__ . "/db.php";



error_reporting(0);
ini_set('display_errors', 0);

if (!isset($_GET['user_id']) || !isset($_GET['training_plan_id'])) {
    echo json_encode(["success" => false, "error" => "Missing parameters"]);
    exit;
}

$user_id = intval($_GET['user_id']);
$training_plan_id = intval($_GET['training_plan_id']);

try {
   
    $query = "SELECT section_id FROM trainingprogress WHERE user_id = ? AND training_plan_id = ? AND status = 'completed'";
    $stmt = $pdo->prepare($query);
    $stmt->execute([$user_id, $training_plan_id]);
    $completedSections = $stmt->fetchAll(PDO::FETCH_COLUMN);

    echo json_encode(["success" => true, "completedSections" => $completedSections]);
    exit;
} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
    exit;
}
?>