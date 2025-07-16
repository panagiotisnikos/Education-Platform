<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");

include_once __DIR__ . "/db.php";

ini_set('display_errors', 1);
error_reporting(E_ALL);

$response = ["success" => false, "error" => "Unknown error"];

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    $response["error"] = "Invalid request method";
    echo json_encode($response);
    exit;
}

if (empty($_FILES)) {
    $response["error"] = "No files received!";
    echo json_encode($response);
    exit;
}

if (!isset($_POST["title"], $_POST["description"], $_POST["user_id"])) {
    $response["error"] = "Missing required fields";
    echo json_encode($response);
    exit;
}

$title = $_POST["title"];
$description = $_POST["description"];
$user_id = $_POST["user_id"];
$image_url = null;

if (!empty($_FILES["image"]["name"])) {
    $target_dir = __DIR__ . "/../uploads/";  
    if (!is_dir($target_dir)) {
        mkdir($target_dir, 0777, true);
    }

    $image_name = time() . "_" . basename($_FILES["image"]["name"]);
    $target_file = $target_dir . $image_name;

    $response["debug"]["target_file"] = $target_file;
    $response["debug"]["tmp_name"] = $_FILES["image"]["tmp_name"];
    $response["debug"]["error"] = $_FILES["image"]["error"];

    if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
        $image_url = "uploads/" . $image_name;
    } else {
        $response["error"] = "Failed to upload image!";
        echo json_encode($response);
        exit;
    }
}

try {
    $query = "INSERT INTO trainingplans (title, description, user_id, image_url) VALUES (?, ?, ?, ?)";
    $stmt = $pdo->prepare($query);

    if ($stmt->execute([$title, $description, $user_id, $image_url])) {
        $response["success"] = true;
        $response["message"] = "Training Plan created successfully!";
    } else {
        $errorInfo = $stmt->errorInfo();
        $response["error"] = "Database error: " . $errorInfo[2];
    }
} catch (PDOException $e) {
    $response["error"] = "SQL Error: " . $e->getMessage();
}

echo json_encode($response);
?>






