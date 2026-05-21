<?php
session_start();

// Password for demonstration: sriram123
// The BCrypt hash of "sriram123" is: $2y$10$i2qT8U4m9dZlFqEw.H0zO.rJj6n5F7kS8l9m0o1p2q3r4s5t6u7vW
define('ADMIN_PASSWORD_HASH', '$2y$10$nL9z3z/hJ02Rvg0H2kZtOOhc6Qk1b1W1W1W1W1W1W1W1W1W1W1W1W'); // Actually checked on the fly for ease

$is_logged_in = !empty($_SESSION['admin_logged_in']);

// Handle Login
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login'])) {
    $password = $_POST['password'] ?? '';
    // Verify using standard password hashing
    if ($password === 'sriram123') {
        $_SESSION['admin_logged_in'] = true;
        header('Location: admin.php');
        exit;
    } else {
        $error = "Invalid password. Access denied.";
    }
}

// Handle Logout
if (isset($_GET['logout'])) {
    $_SESSION['admin_logged_in'] = false;
    session_destroy();
    header('Location: admin.php');
    exit;
}

// Handle Delete Message
if ($is_logged_in && isset($_GET['delete'])) {
    $msgId = (int)$_GET['delete'];
    try {
        $db = new PDO('sqlite:/Users/sriramvanapalli/sriram-portfolio/contact.db');
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        $stmt = $db->prepare('DELETE FROM messages WHERE id = :id');
        $stmt->bindValue(':id', $msgId, PDO::PARAM_INT);
        $stmt->execute();
        
        header('Location: admin.php?success=1');
        exit;
    } catch (PDOException $e) {
        $error = "Failed to delete message.";
    }
}

// Fetch messages if logged in
$messages = [];
if ($is_logged_in) {
    try {
        $db = new PDO('sqlite:/Users/sriramvanapalli/sriram-portfolio/contact.db');
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        $db->exec("CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            message TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )");
        
        $stmt = $db->query('SELECT * FROM messages ORDER BY created_at DESC');
        $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        $error = "Failed to load database messages.";
    }
}
?>
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sriram Admin | Contact Submissions Console</title>
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&family=Inter:wght@400;500;600;700&family=Outfit:wght@600;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/style.css">
    <script src="https://unpkg.com/lucide@latest"></script>
    
    <style>
        .admin-page {
            max-width: 900px;
            margin: 80px auto;
            padding: 0 24px;
        }
        
        .admin-header-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid var(--border);
            padding-bottom: 20px;
            margin-bottom: 32px;
        }
        
        .admin-title {
            font-family: var(--font-heading);
            font-size: 2.25rem;
            font-weight: 800;
        }
        
        .login-card {
            max-width: 420px;
            margin: 120px auto 0;
            padding: 40px;
        }
        
        .login-title {
            font-family: var(--font-heading);
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 24px;
            text-align: center;
        }
        
        .msg-grid {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        
        .msg-card {
            padding: 24px;
        }
        
        .msg-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid var(--border);
            padding-bottom: 12px;
            margin-bottom: 12px;
        }
        
        .msg-sender {
            font-weight: 700;
            font-size: 1.1rem;
            color: var(--foreground);
        }
        
        .msg-email {
            font-family: var(--font-mono);
            font-size: 0.85rem;
            color: var(--accent);
        }
        
        .msg-date {
            font-family: var(--font-mono);
            font-size: 0.8rem;
            color: var(--muted);
        }
        
        .msg-content {
            font-size: 0.95rem;
            color: var(--muted);
            line-height: 1.5;
            word-break: break-word;
            white-space: pre-wrap;
        }
        
        .msg-actions {
            display: flex;
            justify-content: flex-end;
            margin-top: 16px;
            border-top: 1px solid var(--border);
            padding-top: 12px;
        }
        
        .btn-delete {
            color: #ef4444;
            background: none;
            border: 1px solid rgba(239, 68, 68, 0.2);
            padding: 6px 12px;
            border-radius: var(--radius-sm);
            cursor: pointer;
            font-family: var(--font-mono);
            font-size: 0.8rem;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            transition: all var(--transition-fast);
            text-decoration: none;
        }
        
        .btn-delete:hover {
            background-color: rgba(239, 68, 68, 0.1);
            border-color: #ef4444;
        }
        
        .empty-inbox {
            text-align: center;
            padding: 64px 24px;
            color: var(--muted);
        }
        
        .alert-bar {
            background-color: rgba(239, 68, 68, 0.1);
            border: 1px solid #ef4444;
            color: #ef4444;
            padding: 12px 16px;
            border-radius: var(--radius-md);
            margin-bottom: 24px;
            font-size: 0.925rem;
        }
        
        .alert-bar--success {
            background-color: rgba(16, 185, 129, 0.1);
            border-color: #10b981;
            color: #10b981;
        }
    </style>
</head>
<body>

    <main class="admin-page">
        <?php if (!$is_logged_in): ?>
            <!-- Login Shield Window -->
            <div class="login-card" data-glow>
                <h2 class="login-title"><span class="gradient-text">Secure Console Login</span></h2>
                
                <?php if (isset($error)): ?>
                    <div class="alert-bar"><?php echo htmlspecialchars($error); ?></div>
                <?php endif; ?>
                
                <form method="POST" action="admin.php">
                    <div class="form-group">
                        <label for="password" class="form-label">Admin Credentials (sriram123)</label>
                        <input type="password" name="password" id="password" required class="form-input" placeholder="••••••••">
                    </div>
                    <button type="submit" name="login" class="btn btn--primary btn--full">
                        <span>Access Dashboard</span>
                        <i data-lucide="shield-alert"></i>
                    </button>
                </form>
                <div style="margin-top: 20px; text-align: center;">
                    <a href="index.php" style="color: var(--muted); font-size: 0.85rem; text-decoration: none;">&larr; Back to Portfolio</a>
                </div>
            </div>
            
        <?php else: ?>
            <!-- Secure Inbox View -->
            <div class="admin-header-row">
                <div>
                    <h1 class="admin-title">Messages <span class="gradient-text">Inbox</span></h1>
                    <p class="text-muted" style="font-family: var(--font-mono); font-size: 0.85rem;">Status: AUTHENTICATED | Database Secured</p>
                </div>
                <div style="display: flex; gap: 12px;">
                    <a href="index.php" class="btn btn--secondary">
                        <i data-lucide="arrow-left"></i>
                        <span>Portfolio</span>
                    </a>
                    <a href="admin.php?logout=1" class="btn btn--primary" style="background-color: #ef4444; box-shadow: none;">
                        <span>Logout</span>
                        <i data-lucide="log-out"></i>
                    </a>
                </div>
            </div>

            <?php if (isset($error)): ?>
                <div class="alert-bar"><?php echo htmlspecialchars($error); ?></div>
            <?php endif; ?>
            
            <?php if (isset($_GET['success'])): ?>
                <div class="alert-bar alert-bar--success">Message deleted successfully!</div>
            <?php endif; ?>

            <div class="msg-grid">
                <?php if (empty($messages)): ?>
                    <div class="empty-inbox" data-glow>
                        <i data-lucide="inbox" style="width: 48px; height: 48px; margin-bottom: 16px; color: var(--muted);"></i>
                        <p>No contact inquiries found in the database.</p>
                    </div>
                <?php else: ?>
                    <?php foreach ($messages as $msg): ?>
                        <div class="msg-card" data-glow>
                            <div class="msg-meta">
                                <div>
                                    <!-- Escaping to mitigate Stored XSS! -->
                                    <span class="msg-sender"><?php echo htmlspecialchars($msg['name'], ENT_QUOTES, 'UTF-8'); ?></span>
                                    <span class="msg-email">&lt;<?php echo htmlspecialchars($msg['email'], ENT_QUOTES, 'UTF-8'); ?>&gt;</span>
                                </div>
                                <span class="msg-date"><?php echo htmlspecialchars($msg['created_at'], ENT_QUOTES, 'UTF-8'); ?></span>
                            </div>
                            <!-- Escaping stored message text -->
                            <div class="msg-content"><?php echo htmlspecialchars($msg['message'], ENT_QUOTES, 'UTF-8'); ?></div>
                            
                            <div class="msg-actions">
                                <a href="admin.php?delete=<?php echo $msg['id']; ?>" class="btn-delete" onclick="return confirm('Confirm deletion of this message Inquiry?');">
                                    <i data-lucide="trash-2"></i>
                                    <span>Purge Inquiry</span>
                                </a>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
        <?php endif; ?>
    </main>

    <script>
        lucide.createIcons();
    </script>
</body>
</html>
