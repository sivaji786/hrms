<?php
require 'vendor/autoload.php';
require 'app/Config/Constants.php';

$config = new Config\Database();
$dbConfig = $config->default;

// Override with .env if exists
if (file_exists('.env')) {
    $env = parse_ini_file('.env');
    if (isset($env['database.default.hostname'])) $dbConfig['hostname'] = $env['database.default.hostname'];
    if (isset($env['database.default.database'])) $dbConfig['database'] = $env['database.default.database'];
    if (isset($env['database.default.username'])) $dbConfig['username'] = $env['database.default.username'];
    if (isset($env['database.default.password'])) $dbConfig['password'] = $env['database.default.password'];
}

try {
    $mysqli = new mysqli($dbConfig['hostname'], $dbConfig['username'], $dbConfig['password'], $dbConfig['database']);
    if ($mysqli->connect_error) {
        die("Connection failed: " . $mysqli->connect_error);
    }

    $result = $mysqli->query("SELECT * FROM holidays ORDER BY date ASC");
    $holidays = [];
    while ($row = $result->fetch_assoc()) {
        $holidays[] = $row;
    }

    echo json_encode($holidays, JSON_PRETTY_PRINT);
    $mysqli->close();
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
