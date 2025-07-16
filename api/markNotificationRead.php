<?php
require 'db.php';
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$notification_id = $data['notification_id'] ?? null;

if (!$notification_id) {
    echo json_encode(['error' => 'Missing notification ID.']);
    exit;
}

try {
    $stmt = $pdo->prepare("UPDATE Notifications SET is_read = 1 WHERE id = :notification_id");
    $stmt->execute(['notification_id' => $notification_id]);

    echo json_encode(['message' => 'Notification marked as read.']);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Failed to mark notification as read: ' . $e->getMessage()]);
}
?>
