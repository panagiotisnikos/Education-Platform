<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

include_once __DIR__ . "/db.php";

$response = [];

try {
    $input = json_decode(file_get_contents("php://input"), true);

    if (!isset($input["id"])) {
        echo json_encode(["success" => false, "message" => "Missing training plan ID."]);
        exit();
    }

    $trainingPlanId = $input["id"];

    // διαγραφή υλικών
    $stmt = $pdo->prepare("DELETE FROM section_materials WHERE section_id IN (SELECT id FROM sections WHERE training_plan_id = ?)");
    $stmt->execute([$trainingPlanId]);

    // διαγραφή ενοτήτων
    $stmt = $pdo->prepare("DELETE FROM sections WHERE training_plan_id = ?");
    $stmt->execute([$trainingPlanId]);

    // διαγραφή training plan
    $stmt = $pdo->prepare("DELETE FROM trainingplans WHERE id = ?");
    $stmt->execute([$trainingPlanId]);

    echo json_encode(["success" => true, "message" => "Training plan deleted successfully."]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Error deleting training plan: " . $e->getMessage()]);
}
?>
