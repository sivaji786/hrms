<?php

namespace App\Services;

use CodeIgniter\HTTP\Files\UploadedFile;
use App\Libraries\FileSecurity;

class FileUploadService
{
    protected $fileSecurity;

    public function __construct()
    {
        $this->fileSecurity = new FileSecurity();
    }

    /**
     * Store an uploaded file in a standardized directory structure
     *
     * @param UploadedFile $file
     * @param string $module Module name (e.g., 'company', 'employees')
     * @param array $validationRules Custom validation rules
     * @return array|string Returns relative path on success, or array of errors on failure
     */
    public function store(UploadedFile $file, string $module = 'common', array $validationRules = [])
    {
        // 1. Validate File
        $validation = $this->fileSecurity->validate($file, $validationRules);
        if ($validation !== true) {
            return $validation;
        }

        // 2. Generate Directory Path: public/uploads/{module}/{year}/{month}/
        $year = date('Y');
        $month = date('m');
        $relativePath = "uploads/{$module}/{$year}/{$month}";
        $absolutePath = FCPATH . $relativePath;

        // Ensure directory exists
        if (!is_dir($absolutePath)) {
            mkdir($absolutePath, 0755, true);
        }

        // 3. Generate Secure Filename
        $newName = $file->getRandomName();

        // 4. Move File
        try {
            $file->move($absolutePath, $newName);
        } catch (\Exception $e) {
            return ['File upload failed: ' . $e->getMessage()];
        }

        // 5. Return Relative Path for Database
        return $relativePath . '/' . $newName;
    }

    /**
     * Delete an old file from the server
     *
     * @param string|null $oldPath Relative path to the old file (e.g., 'uploads/company/2025/12/file.jpg')
     * @return bool True if deleted or doesn't exist, false on error
     */
    public function deleteOldFile(?string $oldPath): bool
    {
        // If no path provided, nothing to delete
        if (empty($oldPath)) {
            return true;
        }

        // Security: Ensure path is within uploads directory
        if (strpos($oldPath, 'uploads/') !== 0) {
            $logger = new \App\Libraries\SecurityLogger();
            $logger->log('INVALID_FILE_PATH', 'Attempted to delete file outside uploads directory', ['path' => $oldPath]);
            return false;
        }

        // Build full path
        $fullPath = FCPATH . $oldPath;

        // Check if file exists and is a file (not directory)
        if (!file_exists($fullPath)) {
            return true; // Already deleted or never existed
        }

        if (!is_file($fullPath)) {
            $logger = new \App\Libraries\SecurityLogger();
            $logger->log('INVALID_FILE_TYPE', 'Attempted to delete non-file', ['path' => $oldPath]);
            return false;
        }

        // Attempt deletion
        try {
            $result = unlink($fullPath);
            
            if ($result) {
                $logger = new \App\Libraries\SecurityLogger();
                $logger->log('FILE_DELETED', 'Old file deleted successfully', ['path' => $oldPath]);
            }
            
            return $result;
        } catch (\Exception $e) {
            $logger = new \App\Libraries\SecurityLogger();
            $logger->log('FILE_DELETE_ERROR', 'Failed to delete file: ' . $e->getMessage(), ['path' => $oldPath]);
            return false;
        }
    }
}
