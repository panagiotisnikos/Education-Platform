<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include_once __DIR__ . "/db.php";


$response = ["success" => false];

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $user_id = $_POST["user_id"];
    $full_name = $_POST["full_name"];
    $email = $_POST["email"];
    $profile_image = null;

    // ✅ Έλεγχος για κενό email
    if (empty($email)) {
        echo json_encode(["success" => false, "error" => "Email cannot be empty."]);
        exit();
    }

    // 🔍 Ελέγχουμε αν υπάρχει ήδη εικόνα
    $stmt = $pdo->prepare("SELECT profile_image FROM users WHERE id = ?");
    $stmt->execute([$user_id]);
    $current_image = $stmt->fetchColumn();

    // ✅ Επεξεργασία εικόνας
    if (isset($_FILES["profile_image"]) && $_FILES["profile_image"]["error"] == 0) {
        $target_dir = "../uploads/";
        $file_name = time() . "_" . basename($_FILES["profile_image"]["name"]);
        $target_file = $target_dir . $file_name;

        if (move_uploaded_file($_FILES["profile_image"]["tmp_name"], $target_file)) {
            $profile_image = "uploads/" . $file_name;
        } else {
            echo json_encode(["success" => false, "error" => "Failed to upload image."]);
            exit();
        }
    } else {
        $profile_image = $current_image; // ✅ Αν δεν υπάρχει νέα εικόνα, κρατάμε την παλιά
    }

    // 🔄 Ενημέρωση του χρήστη
    $query = "UPDATE users SET full_name = ?, email = ?, profile_image = ? WHERE id = ?";
    $stmt = $pdo->prepare($query);
    $result = $stmt->execute([$full_name, $email, $profile_image, $user_id]);

    if ($result) {
        echo json_encode(["success" => true, "message" => "Profile updated successfully!", "profile_image" => $profile_image]);
    } else {
        echo json_encode(["success" => false, "error" => "Database update failed."]);
    }
}
?>
