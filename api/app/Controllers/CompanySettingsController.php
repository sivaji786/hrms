<?php

namespace App\Controllers;

use App\Models\CompanySettingsModel;
use CodeIgniter\API\ResponseTrait;

class CompanySettingsController extends ApiController
{
    // use ResponseTrait; // Inherited

    protected $settingsModel;

    public function __construct()
    {
        $this->settingsModel = new CompanySettingsModel();
    }

    public function index()
    {
        // Always get the first record as we treat it as a singleton for now
        $settings = $this->settingsModel->first();
        
        if (!$settings) {
            // Should be seeded, but just in case
            return $this->respondSuccess([]);
        }

        return $this->respondSuccess($settings);
    }

    public function update($id = null)
    {
        // DEBUG: Log that update method was called
        error_log('=== CompanySettings UPDATE METHOD CALLED ===');
        error_log('Request Method: ' . $this->request->getMethod());
        error_log('Content-Type: ' . $this->request->getHeaderLine('Content-Type'));
        error_log('POST data: ' . json_encode($this->request->getPost()));
        error_log('FILES: ' . json_encode($_FILES));
        
        // We ignore the ID passed and always update the first record or the one found
        $settings = $this->settingsModel->first();
        $idToUpdate = $settings ? $settings['id'] : null;

        // Handle Multipart/Form-Data
        // When sending files, we must use POST. If using PUT with files, PHP doesn't parse body automatically.
        // We expect the frontend to send POST with _method="PUT" or just POST.
        
        // Use getPost() for form-data, but we need to sanitize it manually or use a helper
        // Since getSecureJson works on JSON body, for POST fields we can iterate and sanitize.
        $data = $this->request->getPost(); 
        
        if (empty($data)) {
             // Fallback for JSON if no file is uploaded
             $data = $this->getSecureJson(true);
        } else {
            // Sanitize POST data manually using the library since getSecureJson is for raw JSON
            $security = new \App\Libraries\InputSecurity();
            $data = $security->sanitize($data);
        }

        // Sanitize Website URL specifically
        if (!empty($data['website'])) {
            $security = new \App\Libraries\InputSecurity();
            $cleanUrl = $security->sanitizeUrl($data['website']);
            if (!$cleanUrl) {
                return $this->respondError('Invalid Website URL', 400);
            }
            $data['website'] = $cleanUrl;
        }

        // Handle File Upload
        $logo = $this->request->getFile('logo');
        
        // Debug: Log file upload attempt
        error_log('CompanySettings: Checking for logo upload');
        error_log('Logo file object: ' . ($logo ? 'exists' : 'null'));
        if ($logo) {
            error_log('Logo isValid: ' . ($logo->isValid() ? 'true' : 'false'));
            error_log('Logo hasMoved: ' . ($logo->hasMoved() ? 'true' : 'false'));
            error_log('Logo error: ' . $logo->getErrorString());
        }
        
        if ($logo && $logo->isValid() && !$logo->hasMoved()) {
            error_log('CompanySettings: Processing logo upload');
            
            // Get old logo path before uploading new one
            $oldSettings = $this->settingsModel->first();
            $oldLogo = $oldSettings['logo_url'] ?? null;

            $fileService = new \App\Services\FileUploadService();
            $result = $fileService->store($logo, 'company', ['max_size' => 2048]);

            if (is_array($result)) {
                error_log('CompanySettings: File validation failed - ' . json_encode($result));
                return $this->respondError('File validation failed', 400, $result);
            }

            error_log('CompanySettings: File uploaded successfully to: ' . $result);

            // Delete old logo file if it exists
            if ($oldLogo) {
                $fileService->deleteOldFile($oldLogo);
            }

            // Update data with new logo URL (relative path returned by service)
            $data['logo_url'] = $result;
            error_log('CompanySettings: logo_url set to: ' . $result);
        } else {
            error_log('CompanySettings: No valid logo file uploaded');
        }

        error_log('Data to be saved: ' . json_encode($data));
        error_log('ID to update: ' . $idToUpdate);

        if (!$idToUpdate) {
            // Create if not exists
            error_log('Creating new company settings');
            if ($this->settingsModel->insert($data)) {
                return $this->respondCreated($this->settingsModel->first(), 'Settings created');
            }
        } else {
            // Update existing
            error_log('Updating existing company settings with ID: ' . $idToUpdate);
            if ($this->settingsModel->update($idToUpdate, $data)) {
                $updated = $this->settingsModel->find($idToUpdate);
                error_log('Updated settings: ' . json_encode($updated));
                return $this->respondSuccess($updated, 'Settings updated');
            }
        }

        error_log('Failed to save settings. Errors: ' . json_encode($this->settingsModel->errors()));
        return $this->respondError('Failed to update settings', 500, $this->settingsModel->errors());
    }
}
