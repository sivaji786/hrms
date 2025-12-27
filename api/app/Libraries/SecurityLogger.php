<?php

namespace App\Libraries;

class SecurityLogger
{
    /**
     * Log a security incident
     *
     * @param string $type Type of incident (e.g., 'AUTH_FAILURE', 'VALIDATION_FAILURE', 'XSS_ATTEMPT')
     * @param string $message Description of the incident
     * @param array $context Additional context (e.g., user ID, IP address, input data)
     * @return void
     */
    public function log(string $type, string $message, array $context = [])
    {
        $logMessage = sprintf(
            '[SECURITY] [%s] %s | Context: %s',
            strtoupper($type),
            $message,
            json_encode($context)
        );

        log_message('critical', $logMessage);
    }
}
