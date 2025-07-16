<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include_once __DIR__ . "/db.php";


if (!isset($_GET['section_id'])) {
    echo json_encode(["success" => false, "error" => "Missing section ID"]);
    exit;
}

$section_id = $_GET['section_id'];

try {
    //  αν section_id υπάρχει στον πίνακα**
    $stmt = $pdo->prepare("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'section_materials' AND COLUMN_NAME = 'section_id'");
    $stmt->execute();
    $columnExists = $stmt->fetch();

    if (!$columnExists) {
        echo json_encode(["success" => false, "error" => "Column 'section_id' does not exist in 'section_materials' table"]);
        exit;
    }

    // **αρχεία του section**
    $stmt = $pdo->prepare("SELECT id, type, file_path FROM section_materials WHERE section_id = ?");
    $stmt->execute([$section_id]);
    $materials = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "materials" => $materials]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>
