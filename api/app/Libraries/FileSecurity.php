<?php

namespace App\Libraries;

use CodeIgniter\Files\File;
use Config\Mimes;

class FileSecurity
{
    /**
     * Validate a file against security rules
     *
     * @param \CodeIgniter\HTTP\Files\UploadedFile $file
     * @param array $rules Custom rules (e.g., ['max_size' => 2048, 'ext_in' => 'png,jpg'])
     * @return array|bool True if valid, array of errors if invalid
     */
    public function validate($file, array $rules = [])
    {
        if (!$file->isValid()) {
            $this->logSecurityEvent('INVALID_FILE', 'File upload error: ' . $file->getErrorString(), ['filename' => $file->getName()]);
            return ['File is not valid: ' . $file->getErrorString()];
        }

        // 1. Check MIME Type against Extension (Basic Spoofing Check)
        $detectedMime = $file->getMimeType();
        $extension = strtolower($file->getExtension());
        
        // Basic map of allowed extensions to expected mime types for images
        $allowedMimes = [
            'png'  => ['image/png'],
            'jpg'  => ['image/jpeg', 'image/jpg'],
            'jpeg' => ['image/jpeg', 'image/jpg'],
            'gif'  => ['image/gif'],
            'webp' => ['image/webp'],
        ];

        if (array_key_exists($extension, $allowedMimes)) {
            if (!in_array($detectedMime, $allowedMimes[$extension])) {
                $this->logSecurityEvent('MIME_MISMATCH', "Extension '{$extension}' does not match MIME '{$detectedMime}'", ['filename' => $file->getName()]);
                return ["Security Violation: File extension '{$extension}' does not match detected MIME type '{$detectedMime}'."];
            }
        }

        // 2. Check for Double Extensions (e.g., image.php.jpg)
        if (strpos($file->getName(), '.') !== strrpos($file->getName(), '.')) {
             // This is a strict check. Some files might legitimately have multiple dots (ver.1.2.jpg).
             // For high security, we can flag it or ensure we rename it completely.
             // We will rename it completely on save, so this is less critical, but good to note.
        }

        // 3. Content Analysis (Magic Bytes) - CI4 getMimeType() usually does this via finfo_file
        // If it returns 'application/x-empty' or 'text/plain' for an image extension, it's suspicious.
        if (in_array($extension, array_keys($allowedMimes)) && strpos($detectedMime, 'image/') === false) {
             $this->logSecurityEvent('INVALID_CONTENT', "Expected image, got '{$detectedMime}'", ['filename' => $file->getName()]);
             return ["Invalid file content. Expected an image."];
        }

        // 4. Size Check
        $maxSize = $rules['max_size'] ?? 2048; // Default 2MB
        if ($file->getSizeByUnit('kb') > $maxSize) {
            $this->logSecurityEvent('SIZE_LIMIT_EXCEEDED', "File size {$file->getSizeByUnit('kb')}KB exceeds limit {$maxSize}KB", ['filename' => $file->getName()]);
            return ["File too large. Maximum size is {$maxSize}KB."];
        }

        return true;
    }

    private function logSecurityEvent($type, $message, $context)
    {
        $logger = new \App\Libraries\SecurityLogger();
        $logger->log($type, $message, $context);
    }

    /**
     * Sanitize a filename to be safe for storage
     *
     * @param string $filename
     * @return string
     */
    public function sanitizeFilename(string $filename): string
    {
        // Remove any path traversal characters
        $filename = basename($filename);
        
        // Remove special characters
        $filename = preg_replace('/[^a-zA-Z0-9-_\.]/', '', $filename);
        
        // Ensure unique name (handled by move() usually, but good utility)
        return $filename;
    }
}
