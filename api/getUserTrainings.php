<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include_once __DIR__ . "/db.php";

if (!isset($_GET['user_id'])) {
    echo json_encode(["success" => false, "error" => "Missing user_id"]);
    exit;
}

$user_id = intval($_GET['user_id']);

// 🔍 Ανάκτηση όλων των εκπαιδεύσεων που έχει ξεκινήσει ο χρήστης
$query = "
    SELECT tp.id, tp.title, tp.description, tp.image_url,
           COALESCE(MAX(tpg.progress), 0) AS progress
    FROM trainingprogress tpg
    JOIN trainingplans tp ON tpg.training_plan_id = tp.id
    WHERE tpg.user_id = ? AND tpg.status IN ('started', 'completed')
    GROUP BY tp.id, tp.title, tp.description, tp.image_url
";

$stmt = $pdo->prepare($query);
$stmt->execute([$user_id]);
$result = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(["success" => true, "trainings" => $result]);
?>