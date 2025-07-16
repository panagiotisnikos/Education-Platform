<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include_once(__DIR__ . "/db.php");


$data = json_decode(file_get_contents("php://input"));

if (!isset($data->id) || !isset($data->title) || !isset($data->content)) {
    echo json_encode(["success" => false, "error" => "Missing required fields"]);
    exit;
}

try {
    $query = "UPDATE sections SET title = :title, content = :content WHERE id = :id";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(":id", $data->id);
    $stmt->bindParam(":title", $data->title);
    $stmt->bindParam(":content", $data->content);
    $stmt->execute();

    echo json_encode(["success" => true, "message" => "Section updated successfully"]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>

