CREATE TABLE images (
    image_url TEXT PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    description VARCHAR(200),
    uploaded_by TEXT NOT NULL,
    metadata TEXT
);