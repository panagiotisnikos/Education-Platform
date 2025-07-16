<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");

include_once __DIR__ . "/db.php";

$training_plan_id = $_GET['training_plan_id'];

$query = "
SELECT 
  r.rating, 
  r.created_at, 
  u.full_name AS trainee_name
FROM ratings r
JOIN users u ON r.user_id = u.id
WHERE r.training_plan_id = ?
ORDER BY r.created_at DESC
";

$stmt = $conn->prepare($query);
$stmt->bind_param('i', $training_plan_id);
$stmt->execute();
$result = $stmt->get_result();

$ratings = [];
while ($row = $result->fetch_assoc()) {
    $ratings[] = $row;
}

echo json_encode(["success" => true, "ratings" => $ratings]);
?>


