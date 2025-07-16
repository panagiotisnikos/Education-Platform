<?php
$host = 'localhost';
$db_name = 'educationplatform';
$username = 'root'; 
$password = ''; 

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode(["success" => false, "error" => "Database connection failed: " . $e->getMessage()]));
}


$conn = $pdo; 
?>

