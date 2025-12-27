-- Update Admin Password to 'admin123'
UPDATE users 
SET password_hash = '$2y$10$oLfN0FFClfAdsjoSgpZZ.e4gdhZmM3qXyvVj20ZStVQ4fgXR9dCjW' 
WHERE email = 'admin@example.com';
