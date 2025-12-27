-- Fix Missing Employee Data
-- Populates NULL fields with realistic mock data

UPDATE employees
SET
    gender = ELT(FLOOR(1 + RAND() * 2), 'Male', 'Female'),
    marital_status = ELT(FLOOR(1 + RAND() * 2), 'Single', 'Married'),
    nationality = ELT(FLOOR(1 + RAND() * 5), 'UAE', 'India', 'Philippines', 'UK', 'USA'),
    phone = CONCAT('+971 5', FLOOR(RAND() * 10), ' ', LPAD(FLOOR(RAND() * 10000000), 7, '0')),
    date_of_birth = DATE_ADD('1980-01-01', INTERVAL FLOOR(RAND() * 10000) DAY),
    blood_group = ELT(FLOOR(1 + RAND() * 8), 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'),
    address = CONCAT('Building ', FLOOR(RAND() * 100), ', Street ', FLOOR(RAND() * 50), ', ', COALESCE(location, 'Dubai')),
    emergency_contact_name = CONCAT('Contact of ', first_name),
    emergency_contact_phone = CONCAT('+971 5', FLOOR(RAND() * 10), ' ', LPAD(FLOOR(RAND() * 10000000), 7, '0')),
    emergency_contact_relation = ELT(FLOOR(1 + RAND() * 4), 'Spouse', 'Parent', 'Sibling', 'Friend'),
    bank_name = ELT(FLOOR(1 + RAND() * 3), 'Emirates NBD', 'ADCB', 'Dubai Islamic Bank'),
    account_number = LPAD(FLOOR(RAND() * 1000000000000), 12, '0'),
    iban = CONCAT('AE', LPAD(FLOOR(RAND() * 99), 2, '0'), '000', LPAD(FLOOR(RAND() * 10000000000000000), 16, '0')),
    emirates_id = CONCAT('784-', FLOOR(1980 + RAND() * 20), '-', LPAD(FLOOR(RAND() * 10000000), 7, '0'), '-', FLOOR(RAND() * 9)),
    passport_number = CONCAT(CHAR(65 + FLOOR(RAND() * 26)), LPAD(FLOOR(RAND() * 10000000), 7, '0')),
    visa_number = CONCAT('201', FLOOR(RAND() * 10), '/', FLOOR(RAND() * 10000000)),
    labour_card_number = LPAD(FLOOR(RAND() * 100000000), 8, '0')
WHERE gender IS NULL OR nationality IS NULL OR phone IS NULL;
