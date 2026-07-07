-- Seed initial gallery items from legacy frontend hardcoded data
INSERT INTO gallery_items (type, url, caption, sort_order, visible)
SELECT 'VIDEO', 'https://res.cloudinary.com/dxkyx2vsa/video/upload/v1772551143/angebot1_eugai2.mp4', NULL, 1, TRUE
WHERE NOT EXISTS (SELECT 1 FROM gallery_items WHERE url = 'https://res.cloudinary.com/dxkyx2vsa/video/upload/v1772551143/angebot1_eugai2.mp4');

INSERT INTO gallery_items (type, url, caption, sort_order, visible)
SELECT 'VIDEO', 'https://res.cloudinary.com/dxkyx2vsa/video/upload/v1772551191/anin1_bzdtmd.mov', NULL, 2, TRUE
WHERE NOT EXISTS (SELECT 1 FROM gallery_items WHERE url = 'https://res.cloudinary.com/dxkyx2vsa/video/upload/v1772551191/anin1_bzdtmd.mov');

INSERT INTO gallery_items (type, url, caption, sort_order, visible)
SELECT 'VIDEO', 'https://res.cloudinary.com/dxkyx2vsa/video/upload/v1772551184/video1_zgfuh3.mp4', NULL, 3, TRUE
WHERE NOT EXISTS (SELECT 1 FROM gallery_items WHERE url = 'https://res.cloudinary.com/dxkyx2vsa/video/upload/v1772551184/video1_zgfuh3.mp4');

INSERT INTO gallery_items (type, url, caption, sort_order, visible)
SELECT 'VIDEO', 'https://res.cloudinary.com/dxkyx2vsa/video/upload/v1772552867/IMG_2767_x7soom.mp4', NULL, 4, TRUE
WHERE NOT EXISTS (SELECT 1 FROM gallery_items WHERE url = 'https://res.cloudinary.com/dxkyx2vsa/video/upload/v1772552867/IMG_2767_x7soom.mp4');

INSERT INTO gallery_items (type, url, caption, sort_order, visible)
SELECT 'VIDEO', '/videos/massage2.mov', NULL, 5, TRUE
WHERE NOT EXISTS (SELECT 1 FROM gallery_items WHERE url = '/videos/massage2.mov');

INSERT INTO gallery_items (type, url, caption, sort_order, visible)
SELECT 'VIDEO', '/videos/skin_cleansing.mov', NULL, 6, TRUE
WHERE NOT EXISTS (SELECT 1 FROM gallery_items WHERE url = '/videos/skin_cleansing.mov');
