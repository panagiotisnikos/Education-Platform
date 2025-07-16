<?php
require 'db.php';
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $training_plan_id = $_POST["training_plan_id"] ?? null;
    $type = $_POST["type"] ?? null;
    $url = $_POST["url"] ?? null;
    $filePath = null;

    if (!$training_plan_id || !$type) {
        echo json_encode(["error" => "Missing required fields"]);
        exit;
    }

    // Διαχείριση αρχείου αν ανεβάστηκε
    if (!empty($_FILES["file"]["name"])) {
        $targetDir = "uploads/";
        $fileName = basename($_FILES["file"]["name"]);
        $targetFilePath = $targetDir . time() . "_" . $fileName;
        
        if (move_uploaded_file($_FILES["file"]["tmp_name"], $targetFilePath)) {
            $filePath = $targetFilePath;
        } else {
            echo json_encode(["error" => "File upload failed"]);
            exit;
        }
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO materials (training_plan_id, type, url, created_at) VALUES (?, ?, ?, NOW())");
        $stmt->execute([$training_plan_id, $type, $filePath ?? $url]);

        echo json_encode(["success" => true]);
    } catch (PDOException $e) {
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
}
?>



