<?php

namespace App\Libraries;

class InputSecurity
{
    /**
     * Recursively sanitize input data
     *
     * @param mixed $input String or Array
     * @return mixed Sanitized input
     */
    public function sanitize($input)
    {
        if (is_array($input)) {
            foreach ($input as $key => $value) {
                $input[$key] = $this->sanitize($value);
            }
            return $input;
        }

        if (is_string($input)) {
            // Remove HTML tags
            $input = strip_tags($input);
            // Convert special characters to HTML entities to prevent XSS
            $input = htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
            return trim($input);
        }

        return $input;
    }

    /**
     * Validate and sanitize a URL
     *
     * @param string $url
     * @return string|null Returns sanitized URL or null if invalid
     */
    public function sanitizeUrl(string $url): ?string
    {
        $url = trim($url);
        
        // Remove control characters
        $url = filter_var($url, FILTER_SANITIZE_URL);

        // Validate URL format
        if (!filter_var($url, FILTER_VALIDATE_URL)) {
            $this->logSecurityEvent('INVALID_URL', 'Malformed URL', ['url' => $url]);
            return null;
        }

        // Check scheme (allow http, https, mailto)
        $scheme = parse_url($url, PHP_URL_SCHEME);
        if (!in_array(strtolower($scheme), ['http', 'https', 'mailto'])) {
            $this->logSecurityEvent('MALICIOUS_URL_SCHEME', "Blocked scheme '{$scheme}'", ['url' => $url]);
            return null; // Reject javascript:, data:, etc.
        }

        return $url;
    }

    private function logSecurityEvent($type, $message, $context)
    {
        $logger = new \App\Libraries\SecurityLogger();
        $logger->log($type, $message, $context);
    }
}
