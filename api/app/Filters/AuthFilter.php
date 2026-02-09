<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        error_log('AuthFilter: Running for ' . $request->getUri());
        error_log('AuthFilter: Method = ' . $request->getMethod());
        $key = getenv('JWT_SECRET');
        error_log('AuthFilter: JWT_SECRET = ' . ($key ? 'SET (' . strlen($key) . ' chars)' : 'NOT SET'));
        
        $header = $request->getHeaderLine('Authorization');
        error_log('AuthFilter: Authorization header = ' . ($header ? $header : 'NOT SET'));
        
        $token = null;

        if (!empty($header)) {
            if (preg_match('/Bearer\s(\S+)/', $header, $matches)) {
                $token = $matches[1];
                error_log('AuthFilter: Token extracted = ' . substr($token, 0, 20) . '...');
            } else {
                error_log('AuthFilter: Bearer pattern not matched in header');
            }
        }

        if (!$token) {
            error_log('AuthFilter: NO TOKEN FOUND - Returning 401');
            $this->logSecurityEvent('AUTH_MISSING_TOKEN', 'No token provided', ['ip' => $request->getIPAddress()]);

            $response = service('response');
            $response->setHeader('Access-Control-Allow-Origin', '*');
            $response->setHeader('Access-Control-Allow-Headers', 'X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization');
            $response->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE, PATCH');
            $response->setJSON([
                'status' => 'error',
                'message' => 'Access denied. No token provided.'
            ]);
            $response->setStatusCode(401);
            return $response;
        }

        try {
            $decoded = JWT::decode($token, new Key($key, 'HS256'));

            \App\Controllers\ApiController::$currentUser = (object) [
                'id' => $decoded->sub,
                'role' => $decoded->role,
                'employee_id' => $decoded->employee_id ?? null
            ];
        } catch (\Exception $e) {
            $this->logSecurityEvent('AUTH_INVALID_TOKEN', 'Invalid token: ' . $e->getMessage(), ['ip' => $request->getIPAddress()]);
            error_log('AuthFilter: JWT Error: ' . $e->getMessage());
            $response = service('response');
            $response->setHeader('Access-Control-Allow-Origin', '*');
            $response->setHeader('Access-Control-Allow-Headers', 'X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization');
            $response->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE, PATCH');
            $response->setJSON([
                'status' => 'error',
                'message' => 'Access denied. Invalid token.'
            ]);
            $response->setStatusCode(401);
            return $response;
        }
    }

    private function logSecurityEvent($type, $message, $context)
    {
        $logger = new \App\Libraries\SecurityLogger();
        $logger->log($type, $message, $context);
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // Do nothing here
    }
}
