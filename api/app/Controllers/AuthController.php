<?php

namespace App\Controllers;

use App\Models\UserModel;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthController extends ApiController
{
    public function login()
    {
        $rules = [
            'email' => 'required|valid_email',
            'password' => 'required|min_length[6]'
        ];

        if (!$this->validate($rules)) {
            return $this->respondError('Validation failed', 400, $this->validator->getErrors());
        }

        $email = $this->request->getVar('email');
        $password = $this->request->getVar('password');

        $userModel = new UserModel();
        $user = $userModel->where('email', $email)->first();

        if (!$user || !password_verify($password, $user['password_hash'])) {
            return $this->respondError('Invalid email or password', 401);
        }

        if ($user['status'] !== 'Active') {
            return $this->respondError('Account is ' . $user['status'], 403);
        }

        $key = getenv('JWT_SECRET');
        $iat = time();
        $exp = $iat + 3600 * 24; // 1 day

        $payload = [
            'iss' => 'hr-system-api',
            'sub' => $user['id'],
            'role' => $user['role_id'], // simplified for now
            'iat' => $iat,
            'exp' => $exp
        ];

        $token = JWT::encode($payload, $key, 'HS256');

        // Update last login
        $userModel->update($user['id'], ['last_login' => date('Y-m-d H:i:s')]);

        return $this->respondSuccess([
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'email' => $user['email'],
                'username' => $user['username'],
                'role' => $user['role_id']
            ]
        ], 'Login successful');
    }

    public function register()
    {
        $rules = [
            'email' => 'required|valid_email|is_unique[users.email]',
            'password' => 'required|min_length[6]',
            'confirm_password' => 'matches[password]'
        ];

        if (!$this->validate($rules)) {
            return $this->respondError('Validation failed', 400, $this->validator->getErrors());
        }

        $userModel = new UserModel();
        
        $data = [
            'email' => $this->request->getVar('email'),
            'password_hash' => password_hash($this->request->getVar('password'), PASSWORD_DEFAULT),
            'status' => 'Active',
            // Assign default role or handle role assignment logic
            'role_id' => 'admin' // Temporary for testing
        ];

        if ($userModel->insert($data)) {
            return $this->respondCreated(null, 'User registered successfully');
        } else {
            return $this->respondError('Failed to register user', 500, $userModel->errors());
        }
    }

    public function me()
    {
        $key = getenv('JWT_SECRET');
        $header = $this->request->getHeaderLine('Authorization');
        $token = null;

        if (!empty($header)) {
            if (preg_match('/Bearer\s(\S+)/', $header, $matches)) {
                $token = $matches[1];
            }
        }

        if (!$token) {
            return $this->respondError('Token not provided', 401);
        }

        try {
            $decoded = JWT::decode($token, new Key($key, 'HS256'));
            $userModel = new UserModel();
            $user = $userModel->find($decoded->sub);
            
            if (!$user) {
                return $this->respondError('User not found', 404);
            }

            unset($user['password_hash']);
            return $this->respondSuccess($user);

        } catch (\Exception $e) {
            return $this->respondError('Invalid token', 401);
        }
    }
}
