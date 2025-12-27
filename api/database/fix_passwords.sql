-- Update admin password to 'admin123'
UPDATE users 
SET password_hash = '$2y$10$oLfN0FFClfAdsjoSgpZZ.e4gdhZmM3qXyvVj20ZStVQ4fgXR9dCjW',
    role_id = 'admin',
    status = 'Active'
WHERE email = 'admin@example.com';

-- Update employee password to 'employee123' and set username
UPDATE users 
SET password_hash = '$2y$10$fwxJ1BZWxl4DflVM7eC83eMYnPaWMZGESEmp5c1v9nEjW4DBoNiBS',
    username = 'john.smith',
    role_id = 'employee',
    status = 'Active'
WHERE email = 'john.smith@company.com';
