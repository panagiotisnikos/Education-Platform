<?php
require 'db.php';
require 'mail.php'; // Χρειάζεται για αποστολή email
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$user_id = $data['user_id'] ?? null;
$new_email = $data['new_email'] ?? null;

if (!$user_id || !$new_email) {
    echo json_encode(['error' => 'Missing parameters.']);
    exit;
}

$token = bin2hex(random_bytes(32)); // Δημιουργία τυχαίου token

try {
    $stmt = $pdo->prepare("INSERT INTO EmailVerifications (user_id, new_email, token) VALUES (:user_id, :new_email, :token)");
    $stmt->execute(['user_id' => $user_id, 'new_email' => $new_email, 'token' => $token]);

    $verification_link = "http://localhost/eduplatform/api/verifyEmail.php?token=$token";
    $subject = "Email Verification";
    $message = "Click the link to verify your email: $verification_link";
    sendMail($new_email, $subject, $message); // Αποστολή email μέσω `mail.php`

    echo json_encode(['success' => true, 'message' => 'Verification email sent!']);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Failed to send verification email: ' . $e->getMessage()]);
}
?>
