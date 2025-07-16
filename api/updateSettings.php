<?php
include_once __DIR__ . "/db.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");


if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $user_id = $_POST["user_id"];
    $new_email = $_POST["new_email"] ?? "";
    $new_password = $_POST["new_password"] ?? "";
    $notifications_enabled = isset($_POST["notifications_enabled"]) ? (int)$_POST["notifications_enabled"] : 1;

    if (empty($user_id)) {
        echo json_encode(["success" => false, "error" => "User ID is missing."]);
        exit();
    }

    try {
        $updates = [];
        $params = [];

        if (!empty($new_email)) {
            $updates[] = "email = ?";
            $params[] = $new_email;
        }

        if (!empty($new_password)) {
            $hashed_password = password_hash($new_password, PASSWORD_BCRYPT);
            $updates[] = "password = ?";
            $params[] = $hashed_password;
        }

        $updates[] = "notifications_enabled = ?";
        $params[] = $notifications_enabled;
        $params[] = $user_id;

        if (!empty($updates)) {
            $query = "UPDATE users SET " . implode(", ", $updates) . " WHERE id = ?";
            $stmt = $pdo->prepare($query);
            $stmt->execute($params);

            if ($stmt->rowCount() > 0) {
                echo json_encode(["success" => true, "message" => "Settings updated successfully."]);
            } else {
                echo json_encode(["success" => false, "error" => "No changes made."]);
            }
        } else {
            echo json_encode(["success" => false, "error" => "No data to update."]);
        }
    } catch (Exception $e) {
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
}
?>
