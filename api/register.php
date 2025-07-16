<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

include_once(__DIR__ . "/db.php");


if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $fullName = isset($_POST["full_name"]) ? trim($_POST["full_name"]) : "";
    $email = isset($_POST["email"]) ? trim($_POST["email"]) : "";
    $password = isset($_POST["password"]) ? password_hash($_POST["password"], PASSWORD_DEFAULT) : "";
    $role = isset($_POST["role"]) ? trim($_POST["role"]) : "trainee";
    $profileImagePath = null;

    // Αποθήκευση εικόνας προφίλ αν υπάρχει
    if (isset($_FILES["profile_image"]) && $_FILES["profile_image"]["error"] === UPLOAD_ERR_OK) {
        $targetDir = "../uploads/";
        if (!file_exists($targetDir)) {
            mkdir($targetDir, 0777, true);
        }
        $fileName = time() . "_" . basename($_FILES["profile_image"]["name"]);
        $targetFilePath = $targetDir . $fileName;
        if (move_uploaded_file($_FILES["profile_image"]["tmp_name"], $targetFilePath)) {
            $profileImagePath = "uploads/" . $fileName;
        }
    }

    // Εισαγωγή στη βάση δεδομένων
    $query = "INSERT INTO users (full_name, email, password, role, profile_image) VALUES (:full_name, :email, :password, :role, :profile_image)";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(":full_name", $fullName);
    $stmt->bindParam(":email", $email);
    $stmt->bindParam(":password", $password);
    $stmt->bindParam(":role", $role);
    $stmt->bindParam(":profile_image", $profileImagePath);

    if ($stmt->execute()) {
        $user = [
            "id" => $pdo->lastInsertId(),
            "full_name" => $fullName,
            "email" => $email,
            "role" => $role,
            "profile_image" => $profileImagePath
        ];
        
        echo json_encode(["success" => true, "user" => $user]);
    } else {
        echo json_encode(["success" => false, "error" => "Database error. Registration failed."]);
    }
}    
?>

