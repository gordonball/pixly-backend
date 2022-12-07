CREATE TABLE images (
    e_tag VARCHAR(50) PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    description VARCHAR(200),
    uploaded_by TEXT NOT NULL,
    image_url TEXT NOT NULL
);