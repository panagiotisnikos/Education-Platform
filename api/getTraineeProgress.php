<?php
include_once __DIR__ . "/db.php";

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

if (!isset($_GET['instructor_id'])) {
    echo json_encode(["success" => false, "error" => "Missing instructor_id"]);
    exit;
}

$instructor_id = $_GET['instructor_id'];

try {
    $query = "SELECT tp.id AS training_id, tp.title, u.id AS user_id, u.full_name, u.email, 
                     tp.created_at, tp.image_url, tpg.progress, tpg.status
              FROM trainingprogress tpg
              JOIN trainingplans tp ON tpg.training_plan_id = tp.id
              JOIN users u ON tpg.user_id = u.id
              WHERE tp.user_id = :instructor_id
              ORDER BY tpg.progress DESC";

    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':instructor_id', $instructor_id, PDO::PARAM_INT);
    $stmt->execute();
    
    $traineeProgress = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode(["success" => true, "traineeProgress" => $traineeProgress]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>
