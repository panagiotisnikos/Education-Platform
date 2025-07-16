<?php
include_once(__DIR__ . "/db.php");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// ✅ Έλεγχος αν υπάρχει το ID του αρχείου
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->id)) {
    echo json_encode(["success" => false, "error" => "Missing file ID"]);
    exit;
}

$fileId = $data->id;

try {
    // ✅ Παίρνουμε το αρχείο από τη βάση για να διαγράψουμε και το αρχείο φυσικά
    $stmt = $pdo->prepare("SELECT file_path FROM section_materials WHERE id = ?");
    $stmt->execute([$fileId]);
    $file = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$file) {
        echo json_encode(["success" => false, "error" => "File not found"]);
        exit;
    }

    // ✅ Διαγραφή του αρχείου από το σύστημα
    $filePath = __DIR__ . "/../uploads/" . $file["file_path"];
    if (file_exists($filePath)) {
        unlink($filePath); // Διαγραφή του αρχείου
    }

    // ✅ Διαγραφή από τη βάση
    $stmt = $pdo->prepare("DELETE FROM section_materials WHERE id = ?");
    $stmt->execute([$fileId]);

    echo json_encode(["success" => true, "message" => "File deleted successfully"]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => "Database error: " . $e->getMessage()]);
}
?>

