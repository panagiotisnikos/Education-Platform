<?php
require 'db.php';
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

try {
    $stmt = $pdo->prepare("SELECT id, title, description, COALESCE(image_url, '') AS image_url, user_id FROM trainingplans");
    $stmt->execute();
    $trainingPlans = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (!$trainingPlans) {
        echo json_encode([]);
    } else {
        echo json_encode($trainingPlans);
    }
} catch (PDOException $e) {
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>


