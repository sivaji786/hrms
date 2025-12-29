<?php
// installer.php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Configuration
$envPath = './api/.env.production';
$finalEnvPath = './api/.env';
$zipFile = 'app.zip';

$message = '';
$status = ''; // success, danger

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    if ($action === 'test_db') {
        $host = $_POST['db_host'] ?? '';
        $user = $_POST['db_user'] ?? '';
        $pass = $_POST['db_password'] ?? '';
        $name = $_POST['db_name'] ?? '';

        try {
            $mysqli = new mysqli($host, $user, $pass, $name);
            if ($mysqli->connect_error) {
                throw new Exception("Connection failed: " . $mysqli->connect_error);
            }
            $message = "Database connection successful!";
            $status = "success";
            $mysqli->close();
        } catch (Exception $e) {
            $message = "Database Error: " . $e->getMessage();
            $status = "danger";
        }
    } elseif ($action === 'install') {
        // 1. Validate Inputs
        $dbHost = $_POST['db_host'] ?? '';
        $dbUser = $_POST['db_user'] ?? '';
        $dbPass = $_POST['db_password'] ?? '';
        $dbName = $_POST['db_name'] ?? '';
        $apiUrl = rtrim($_POST['api_url'] ?? '', '/');
        $appUrl = rtrim($_POST['app_url'] ?? '', '/');

        if (empty($dbHost) || empty($dbUser) || empty($dbName) || empty($apiUrl) || empty($appUrl)) {
            $message = "All fields except DB Password are required.";
            $status = "danger";
        } else {
            // 2. Extract Zip
            if (file_exists($zipFile)) {
                $zip = new ZipArchive;
                if ($zip->open($zipFile) === TRUE) {
                    $zip->extractTo('./');
                    $zip->close();
                    
                    // 3. Configure .env
                    if (file_exists($envPath)) {
                        $envContent = file_get_contents($envPath);
                        
                        $replacements = [
                            '{{DB_HOST}}' => $dbHost,
                            '{{DB_NAME}}' => $dbName,
                            '{{DB_USER}}' => $dbUser,
                            '{{DB_PASSWORD}}' => $dbPass,
                            '{{API_URL}}' => $apiUrl,
                            '{{APP_URL}}' => $appUrl, // Not used in env template but good to have if needed later
                            '{{JWT_SECRET}}' => bin2hex(random_bytes(32))
                        ];
                        
                        $newEnvContent = str_replace(array_keys($replacements), array_values($replacements), $envContent);
                        
                        if (file_put_contents($finalEnvPath, $newEnvContent) !== false) {
                            // 4. Cleanup and Success
                            if (unlink($zipFile)) {
                                $message = "Installation successful! <a href='$appUrl' target='_blank' class='alert-link'>Go to App</a>. <br><strong>IMPORTANT: Please delete this installer.php file manually.</strong>";
                                $status = "success";
                            } else {
                                $message = "Installed, but failed to delete $zipFile. Please delete it manually.";
                                $status = "warning";
                            }
                        } else {
                            $message = "Failed to write .env file. Check permissions.";
                            $status = "danger";
                        }
                    } else {
                        $message = "$envPath not found after extraction.";
                        $status = "danger";
                    }
                } else {
                    $message = "Failed to open $zipFile.";
                    $status = "danger";
                }
            } else {
                $message = "$zipFile not found.";
                $status = "danger";
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>App Installer</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card shadow">
                    <div class="card-header bg-primary text-white">
                        <h4 class="mb-0">Application Installer</h4>
                    </div>
                    <div class="card-body">
                        <?php if ($message): ?>
                            <div class="alert alert-<?php echo $status; ?>">
                                <?php echo $message; ?>
                            </div>
                        <?php endif; ?>

                        <form method="POST">
                            <h5 class="mb-3">Database Configuration</h5>
                            <div class="mb-3">
                                <label class="form-label">Database Host</label>
                                <input type="text" name="db_host" class="form-control" value="<?php echo $_POST['db_host'] ?? 'localhost'; ?>" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Database Name</label>
                                <input type="text" name="db_name" class="form-control" value="<?php echo $_POST['db_name'] ?? ''; ?>" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Database User</label>
                                <input type="text" name="db_user" class="form-control" value="<?php echo $_POST['db_user'] ?? ''; ?>" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Database Password</label>
                                <input type="password" name="db_password" class="form-control" value="<?php echo $_POST['db_password'] ?? ''; ?>">
                            </div>

                            <button type="submit" name="action" value="test_db" class="btn btn-info mb-4 text-white">Test Database Connection</button>

                            <h5 class="mb-3">URL Configuration</h5>
                            <div class="mb-3">
                                <label class="form-label">API URL (Backend)</label>
                                <input type="url" name="api_url" class="form-control" placeholder="https://api.example.com" value="<?php echo $_POST['api_url'] ?? ''; ?>" required>
                                <div class="form-text">The URL where the API/Backend is hosted (e.g., this folder).</div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">App URL (Frontend)</label>
                                <input type="url" name="app_url" class="form-control" placeholder="https://example.com" value="<?php echo $_POST['app_url'] ?? ''; ?>" required>
                                <div class="form-text">The URL where the frontend is accessed.</div>
                            </div>

                            <button type="submit" name="action" value="install" class="btn btn-primary w-100">Install Application</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
