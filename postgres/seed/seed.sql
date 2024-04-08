BEGIN TRANSACTION;
INSERT into users(name, email, age, entries, joined) values ('julia', 'julia@gmail.com', 20, 5, '2024-01-01');
INSERT into login(hash, email) values ('$2b$10$Jr6Kd79PHr42Gnsn0YKu/OZbrIsPUKluOBEZadQ.5p8aQyigJBLaq', 'julia@gmail.com');
COMMIT;