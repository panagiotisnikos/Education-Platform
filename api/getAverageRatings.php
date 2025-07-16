<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");


include_once __DIR__ . "/db.php";

$instructor_id = $_GET['instructor_id'];

$query = "
SELECT 
    tp.id AS training_plan_id, 
    tp.title AS training_title, 
    ROUND(AVG(r.rating),2) AS average_rating,
    tp.user_id
FROM trainingplans tp
LEFT JOIN ratings r ON tp.id = r.training_plan_id
GROUP BY tp.id, tp.title, tp.user_id
ORDER BY average_rating DESC
";

$stmt = $conn->prepare($query);
$stmt->execute();

$ratings = [];
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $ratings[] = [
        "training_plan_id" => $row["training_plan_id"],
        "training_title" => $row["training_title"],
        "average_rating" => $row["average_rating"] ? $row["average_rating"] : "Χωρίς αξιολογήσεις",
        "is_owner" => $row["user_id"] == $instructor_id
    ];
}

echo json_encode(["success" => true, "ratings" => $ratings]);
?>
