<?php
include_once __DIR__ . "/db.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

// Έλεγχος αν υπάρχει σύνδεση
if (!$conn) {
    echo json_encode(["error" => "Database connection failed"]);
    exit();
}

// Λήψη του user_id από το request
$user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;

if ($user_id <= 0) {
    echo json_encode(["error" => "Invalid user ID"]);
    exit();
}

try {
    // Προετοιμασία του SQL query με χρήση PDO
    $sql = "SELECT id, full_name FROM users WHERE id != :user_id";
    $stmt = $conn->prepare($sql);
    $stmt->execute(["user_id" => $user_id]);
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($users)) {
        echo json_encode(["error" => "No users found"]);
    } else {
        echo json_encode($users);
    }
} catch (Exception $e) {
    echo json_encode(["error" => "Query failed: " . $e->getMessage()]);
}
?>
