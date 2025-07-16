<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include_once(__DIR__ . "/db.php");

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->id)) {
    echo json_encode(["success" => false, "error" => "Missing section ID"]);
    exit;
}

try {
    $stmt = $pdo->prepare("DELETE FROM sections WHERE id = ?");
    $stmt->execute([$data->id]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(["success" => true, "message" => "Section deleted successfully"]);
    } else {
        echo json_encode(["success" => false, "error" => "Section not found"]);
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => "Database error: " . $e->getMessage()]);
}
?>
