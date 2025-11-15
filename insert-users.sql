INSERT INTO users (username, password, name, role, email, loginMethod) VALUES
('admin9197', 'Admin9197', 'AL AMIN', 'admin', 'admin@amintouch.com', 'local'),
('ronytalukder', '@jead2016R', 'RONY TALUKDER', 'user', 'rony@amintouch.com', 'local'),
('mahir', 'Mahir3', 'MAHIR', 'user', 'mahir@amintouch.com', 'local'),
('sakiladnan', 'Sakiladnan', 'SAKIL ADNAN', 'user', 'sakil@amintouch.com', 'local')
ON DUPLICATE KEY UPDATE name=VALUES(name);
