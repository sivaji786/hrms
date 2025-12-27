SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE locations;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO locations (id, name, address, city, country) VALUES 
(UUID(), 'Dubai HQ', 'Sheikh Zayed Road, Downtown Dubai', 'Dubai', 'UAE'),
(UUID(), 'Abu Dhabi Branch', 'Al Maryah Island', 'Abu Dhabi', 'UAE'),
(UUID(), 'Sharjah Office', 'Al Majaz Waterfront', 'Sharjah', 'UAE'),
(UUID(), 'Ajman Center', 'Ajman Corniche', 'Ajman', 'UAE'),
(UUID(), 'Ras Al Khaimah Hub', 'Al Hamra Village', 'Ras Al Khaimah', 'UAE'),
(UUID(), 'Fujairah Site', 'Fujairah Creative City', 'Fujairah', 'UAE'),
(UUID(), 'Umm Al Quwain Office', 'King Faisal Street', 'Umm Al Quwain', 'UAE');
