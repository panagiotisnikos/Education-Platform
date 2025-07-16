<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

error_reporting(E_ALL);
ini_set('display_errors', 1);

include_once(__DIR__ . "/db.php");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

if (!isset($_GET["user_id"]) || empty($_GET["user_id"])) {
    echo json_encode(["error" => "Missing required fields"]);
    exit();
}

$user_id = intval($_GET["user_id"]);

try {
    $stmt = $conn->prepare("
        SELECT messages.id, messages.sender_id, messages.receiver_id, messages.message, messages.created_at, 
               users.full_name AS sender_name
        FROM messages
        JOIN users ON messages.sender_id = users.id
        WHERE messages.receiver_id = :user_id OR messages.sender_id = :user_id
        ORDER BY messages.created_at DESC
    ");
    
    $stmt->bindParam(":user_id", $user_id, PDO::PARAM_INT);
    $stmt->execute();
    
    $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (!$messages) {
        echo json_encode([]);
        exit();
    }

    echo json_encode($messages);
} catch (Exception $e) {
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>
