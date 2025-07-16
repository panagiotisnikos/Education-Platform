<?php
include_once __DIR__ . "/db.php";

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

if (!isset($_GET["training_plan_id"])) {
    echo json_encode(["success" => false, "error" => "Missing training_plan_id"]);
    exit;
}

$training_plan_id = $_GET["training_plan_id"];

try {
    // 📌 Φέρνουμε την εκπαίδευση από τη βάση δεδομένων
    $stmt = $pdo->prepare("SELECT * FROM trainingplans WHERE id = ?");
    $stmt->execute([$training_plan_id]);
    $trainingPlan = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$trainingPlan) {
        echo json_encode(["success" => false, "error" => "Training Plan not found"]);
        exit;
    }

    // 📌 Φέρνουμε τα sections αυτής της εκπαίδευσης ΜΕ το content
    $stmt = $pdo->prepare("SELECT id, title, content FROM sections WHERE training_plan_id = ?");
    $stmt->execute([$training_plan_id]);
    $sections = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "trainingPlan" => $trainingPlan,
        "sections" => $sections
    ]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>




