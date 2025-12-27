<?php

namespace App\Controllers;

use CodeIgniter\API\ResponseTrait;
use CodeIgniter\Controller;

class ApiController extends Controller
{
    use ResponseTrait;
    public static $currentUser;


    public function respondSuccess($data = null, string $message = '')
    {
        return $this->respond([
            'status' => 'success',
            'message' => $message,
            'data' => $data
        ], 200);
    }

    public function respondError($message, $code = 400, $errors = null)
    {
        return $this->respond([
            'status' => 'error',
            'message' => $message,
            'errors' => $errors
        ], $code);
    }
    protected function getUser()
    {
        return self::$currentUser;
    }

    /**
     * Get JSON input and sanitize it
     * 
     * @param bool $assoc
     * @return mixed
     */
    protected function getSecureJson($assoc = true)
    {
        $input = $this->request->getJSON($assoc);
        
        if (!$input) {
            return $input;
        }

        $security = new \App\Libraries\InputSecurity();
        return $security->sanitize($input);
    }
}
