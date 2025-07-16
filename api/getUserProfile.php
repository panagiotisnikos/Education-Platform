<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include_once __DIR__ . "/db.php";

if (!isset($_GET['user_id'])) {
    echo json_encode(["success" => false, "error" => "User ID is required."]);
    exit();
}

$user_id = $_GET['user_id'];

// 🔹 Φέρνουμε το email, το όνομα και την εικόνα προφίλ
$userQuery = $pdo->prepare("SELECT email, full_name, profile_image FROM users WHERE id = ?");
$userQuery->execute([$user_id]);
$userData = $userQuery->fetch(PDO::FETCH_ASSOC);

if (!$userData) {
    echo json_encode(["success" => false, "error" => "User not found."]);
    exit();
}

// 🔹 Επιστρέφουμε JSON response
echo json_encode([
    "success" => true,
    "email" => $userData['email'] ?? "",
    "full_name" => $userData['full_name'] ?? "",
    "profile_image" => $userData['profile_image'] ?? ""
]);
?>

