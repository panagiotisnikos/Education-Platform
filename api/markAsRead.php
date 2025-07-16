<?php
include_once(__DIR__ . "/db.php");

$data = json_decode(file_get_contents("php://input"));
$message_id = $data->message_id;

$sql = "UPDATE messages SET is_read = 1 WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $message_id);
$response = ["success" => $stmt->execute()];

echo json_encode($response);
?>
