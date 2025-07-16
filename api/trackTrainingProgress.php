<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
header("Content-Type: application/json; charset=UTF-8");


include_once __DIR__ . "/db.php";

error_reporting(0);
ini_set('display_errors', 0);

// Έλεγχος αν έγινε POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "error" => "Invalid request method"]);
    exit;
}

// Λήψη δεδομένων από το request body
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['user_id'], $data['training_plan_id'])) {
    echo json_encode(["success" => false, "error" => "Missing parameters"]);
    exit;
}

$user_id = $data['user_id'];
$training_plan_id = $data['training_plan_id'];
$section_id = isset($data['section_id']) ? $data['section_id'] : null;
$status = isset($data['status']) ? $data['status'] : 'in_progress';
$progress = $data['progress'];
try {
    // ✅ Αν η εκπαίδευση δεν υπάρχει στο trainingprogress, την προσθέτουμε
    $checkTrainingQuery = "SELECT * FROM trainingprogress WHERE user_id = ? AND training_plan_id = ?";
    $stmt = $pdo->prepare($checkTrainingQuery);
    $stmt->execute([$user_id, $training_plan_id]);
    $result = $stmt->fetch();

    if (!$result) {
        $query = "UPDATE trainingprogress SET status = ?, progress = ?, section_id = ?, timestamp = CURRENT_TIMESTAMP WHERE user_id = ? AND training_plan_id = ?";
        $stmt = $pdo->prepare($query);
        $stmt->execute([$status, $progress, $section_id, $user_id, $training_plan_id]);
    
    }

    // ✅ Αν το section έχει ολοκληρωθεί, προσθέτουμε εγγραφή
    if ($section_id !== null) {
        $insertSectionQuery = "INSERT INTO trainingprogress (user_id, training_plan_id, section_id, status) 
                               VALUES (?, ?, ?, 'started')
                               ON DUPLICATE KEY UPDATE status = 'completed'";
        $stmt = $pdo->prepare($insertSectionQuery);
        $stmt->execute([$user_id, $training_plan_id, $section_id]);
    }

    // ✅ Υπολογισμός της συνολικής προόδου
    $totalSectionsQuery = "SELECT COUNT(*) as total FROM sections WHERE training_plan_id = ?";
    $stmt = $pdo->prepare($totalSectionsQuery);
    $stmt->execute([$training_plan_id]);
    $totalResult = $stmt->fetch(PDO::FETCH_ASSOC);
    $totalSections = $totalResult['total'];

    $completedSectionsQuery = "SELECT COUNT(DISTINCT section_id) as completed FROM trainingprogress WHERE user_id = ? AND training_plan_id = ?";
    $stmt = $pdo->prepare($completedSectionsQuery);
    $stmt->execute([$user_id, $training_plan_id]);
    $completedResult = $stmt->fetch(PDO::FETCH_ASSOC);
    $completedSections = $completedResult['completed'];

    $progress = ($totalSections > 0) ? round(($completedSections / $totalSections) * 100, 2) : 0;

    // ✅ Ενημέρωση της συνολικής προόδου και του status (ΜΟΝΟ αν είναι 100%)
    if ($progress == 100) {
        $updateProgressQuery = "UPDATE trainingprogress 
                                SET progress = ?, status = 'completed' 
                                WHERE user_id = ? AND training_plan_id = ?";
    } else {
        $updateProgressQuery = "UPDATE trainingprogress 
                                SET progress = ? 
                                WHERE user_id = ? AND training_plan_id = ?";
    }
    
    $stmt = $pdo->prepare($updateProgressQuery);
    $stmt->execute([$progress, $user_id, $training_plan_id]);

    echo json_encode(["success" => true, "message" => "Training progress updated successfully", "progress" => $progress]);
    exit;
} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
    exit;
}
?>




