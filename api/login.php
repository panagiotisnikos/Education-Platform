<?php
require 'db.php';
header("Content-Type: application/json"); 
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$response = ["success" => false, "message" => "Invalid email or password"];

// ✅ Έλεγχος αν τα δεδομένα έχουν σταλεί σωστά
$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data["email"]) || !isset($data["password"])) {
    echo json_encode(["success" => false, "message" => "Missing email or password"]);
    exit();
}

$email = trim($data["email"]);
$password = trim($data["password"]);

try {
    $stmt = $pdo->prepare("SELECT id, email, password, role FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user["password"])) {
        unset($user["password"]); // ✅ Αφαίρεση password από την απάντηση
        $response = ["success" => true, "user" => $user];
    }
} catch (PDOException $e) {
    $response = ["success" => false, "message" => "Database error: " . $e->getMessage()];
}

// ✅ Επιστροφή JSON χωρίς επιπλέον περιεχόμενο
echo json_encode($response);
exit();
?>

