<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Χειρισμός προ-ελέγχου OPTIONS request
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

include_once(__DIR__ . "/db.php");

$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input["sender_id"], $input["receiver_id"], $input["message"])) {
    echo json_encode(["error" => "Missing required fields"]);
    exit();
}

$sender_id = intval($input["sender_id"]);
$receiver_id = intval($input["receiver_id"]);
$message = trim($input["message"]);

if ($sender_id <= 0 || $receiver_id <= 0 || empty($message)) {
    echo json_encode(["error" => "Invalid input values"]);
    exit();
}

try {
    $stmt = $conn->prepare("INSERT INTO messages (sender_id, receiver_id, message, created_at) VALUES (:sender, :receiver, :message, NOW())");
    $stmt->execute(["sender" => $sender_id, "receiver" => $receiver_id, "message" => $message]);

    echo json_encode(["success" => "Message sent successfully"]);
} catch (Exception $e) {
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>

