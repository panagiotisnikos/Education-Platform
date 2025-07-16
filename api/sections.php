<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../api/db.php'; 

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    // Προσθήκη νέου κεφαλαίου
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['training_plan_id'], $data['title'])) {
        echo json_encode(["success" => false, "message" => "Missing required fields"]);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO sections (training_plan_id, title, content) VALUES (?, ?, ?)");
    $stmt->bind_param("iss", $data['training_plan_id'], $data['title'], $data['content']);
    
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "id" => $stmt->insert_id]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to add section"]);
    }
    exit;
}

if ($method === 'GET') {
    // Ανάκτηση κεφαλαίων ενός training plan
    if (!isset($_GET['training_plan_id'])) {
        echo json_encode(["success" => false, "message" => "Training plan ID is required"]);
        exit;
    }

    $training_plan_id = intval($_GET['training_plan_id']);
    $stmt = $conn->prepare("SELECT * FROM sections WHERE training_plan_id = ?");
    $stmt->bind_param("i", $training_plan_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $sections = [];
    while ($row = $result->fetch_assoc()) {
        $sections[] = $row;
    }

    echo json_encode(["success" => true, "sections" => $sections]);
    exit;
}

if ($method === 'PUT') {
    // Ενημέρωση κεφαλαίου
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['id'], $data['title'], $data['content'])) {
        echo json_encode(["success" => false, "message" => "Missing required fields"]);
        exit;
    }

    $stmt = $conn->prepare("UPDATE sections SET title = ?, content = ? WHERE id = ?");
    $stmt->bind_param("ssi", $data['title'], $data['content'], $data['id']);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Section updated"]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to update section"]);
    }
    exit;
}

if ($method === 'DELETE') {
    // Διαγραφή κεφαλαίου
    parse_str(file_get_contents("php://input"), $data);

    if (!isset($data['id'])) {
        echo json_encode(["success" => false, "message" => "Section ID is required"]);
        exit;
    }

    $stmt = $conn->prepare("DELETE FROM sections WHERE id = ?");
    $stmt->bind_param("i", $data['id']);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Section deleted"]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to delete section"]);
    }
    exit;
}

echo json_encode(["success" => false, "message" => "Invalid request"]);
?>

