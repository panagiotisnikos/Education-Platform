<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

error_reporting(E_ALL);
ini_set('display_errors', 1);

include_once __DIR__ . "/db.php";

$response = [];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (!isset($_FILES["file"]) || !isset($_POST["section_id"])) {
        echo json_encode(["success" => false, "message" => "Missing parameters."]);
        exit();
    }

    $section_id = $_POST["section_id"];
    $file = $_FILES["file"];

  
    $uploadDir = __DIR__ . "/uploads/";

    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $fileName = time() . "_" . basename($file["name"]);
    $filePath = $uploadDir . $fileName;
    $fileType = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

    if (move_uploaded_file($file["tmp_name"], $filePath)) {
        $allowedTypes = ['pdf', 'mp4'];
        if (in_array($fileType, $allowedTypes)) {
            $type = ($fileType == 'pdf') ? 'pdf' : 'video';
            
            // αποθήκευση του path στη βάση
            $relativeFilePath = "uploads/" . $fileName;

            $stmt = $pdo->prepare("INSERT INTO section_materials (section_id, type, file_path) VALUES (?, ?, ?)");
            $stmt->execute([$section_id, $type, $relativeFilePath]);

            echo json_encode(["success" => true, "message" => "File uploaded successfully!", "file_path" => $relativeFilePath]);
        } else {
            unlink($filePath);
            echo json_encode(["success" => false, "message" => "Invalid file type."]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "File upload failed."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
}

?>