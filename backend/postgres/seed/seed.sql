BEGIN TRANSACTION;
INSERT into users(name, email, profile_image, age, entries, joined) values ('julia', 'julia@gmail.com', 'http://localhost:3001/uploads/default-profile-image.png',20, 5, '2025-01-01');
INSERT into login(hash, email) values ('$2b$10$Jr6Kd79PHr42Gnsn0YKu/OZbrIsPUKluOBEZadQ.5p8aQyigJBLaq', 'julia@gmail.com');
COMMIT;