<?php
require 'db.php';
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_POST['training_plan_id']) || empty($_POST['training_plan_id'])) {
        echo json_encode(["error" => "Training plan ID is required"]);
        exit;
    }

    $training_plan_id = intval($_POST['training_plan_id']);
    $upload_dir = "../uploads/";

    if (!file_exists($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }

    if (!empty($_FILES["file"]["name"])) {
        $file_name = basename($_FILES["file"]["name"]);
        $target_file = $upload_dir . $file_name;
        $file_type = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

        $allowed_types = ["jpg", "jpeg", "png", "gif"];

        if (!in_array($file_type, $allowed_types)) {
            echo json_encode(["error" => "Invalid file type. Allowed: JPG, JPEG, PNG, GIF"]);
            exit;
        }

        if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_file)) {
            $file_url = "uploads/" . $file_name;

            $stmt = $pdo->prepare("UPDATE trainingplans SET image_url = ? WHERE id = ?");
            if ($stmt->execute([$file_url, $training_plan_id])) {
                echo json_encode(["success" => true, "image_url" => $file_url]);
            } else {
                echo json_encode(["error" => "Database update failed"]);
            }
        } else {
            echo json_encode(["error" => "File upload failed"]);
        }
    } else {
        echo json_encode(["error" => "No file uploaded"]);
    }
}
?>

