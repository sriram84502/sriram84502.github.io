<?php
session_start();
header('Content-Type: application/json');

// Check if request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
    exit;
}

// 1. Anti-CSRF Token Validation
if (empty($_POST['csrf_token']) || empty($_SESSION['csrf_token']) || !hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'])) {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'CSRF validation failed. Unauthorized request.']);
    exit;
}

// 2. Input Sanitization & Validation (XSS Prevention)
$name = isset($_POST['name']) ? htmlspecialchars(trim($_POST['name']), ENT_QUOTES, 'UTF-8') : '';
$email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_VALIDATE_EMAIL) : false;
$message = isset($_POST['message']) ? htmlspecialchars(trim($_POST['message']), ENT_QUOTES, 'UTF-8') : '';

if (empty($name) || strlen($name) < 2) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Please enter a valid name (minimum 2 characters).']);
    exit;
}

if (!$email) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Please enter a valid email address.']);
    exit;
}

if (empty($message) || strlen($message) < 10) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Please enter a valid message (minimum 10 characters).']);
    exit;
}

try {
    // 3. SQLite Database Secure Insertion
    $dbPath = '/Users/sriramvanapalli/sriram-portfolio/contact.db';
    $db = new PDO('sqlite:' . $dbPath);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Auto-create table on first load
    $db->exec("CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");
    
    // Prepared Statement to fully prevent SQL Injection
    $stmt = $db->prepare('INSERT INTO messages (name, email, message) VALUES (:name, :email, :message)');
    $stmt->bindValue(':name', $name, PDO::PARAM_STR);
    $stmt->bindValue(':email', $_POST['email'], PDO::PARAM_STR); // Save unsanitized string in DB safely via prepared variables, XSS sanitization happens during rendering
    $stmt->bindValue(':message', $message, PDO::PARAM_STR);
    $stmt->execute();
    
    echo json_encode(['status' => 'success', 'message' => 'Message securely stored! Thank you for getting in touch.']);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database error. Unable to process message.']);
}
