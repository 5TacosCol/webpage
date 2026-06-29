-- Limpiar productos existentes antes de insertar
TRUNCATE products RESTART IDENTITY CASCADE;

-- PARA COMPARTIR
INSERT INTO products (name, description, price, category, sort_order) VALUES
('Totopos', 'Totopos de puro maíz con guacamole', 6000, 'para_compartir', 1),
('Nachos', 'Cama de totopos crujientes, DOS proteínas a elección, queso doble crema + cheddar, pico de gallo, guacamole y crema agria', 22000, 'para_compartir', 2);

UPDATE products SET has_protein_choice = true, max_proteins = 2 WHERE name = 'Nachos';

-- TACOS
INSERT INTO products (name, description, price, category, has_costra_option, sort_order) VALUES
('Birria de res', 'Res cocida lentamente en caldo de chiles, tomate y especias', 7000, 'tacos', true, 1),
('Chicharrón', 'Pequeños trozos de cerdo fritos, crocantes y deliciosos', 6000, 'tacos', true, 2),
('Chorizo Mexicano', 'Pernil de cerdo molido sazonado con chiles, paprika y especias, asado en plancha', 6000, 'tacos', true, 3),
('Tinga de Pollo', 'Pollo desmechado guisado en salsa de tomates con cebolla y chiles chipotle', 6000, 'tacos', true, 4),
('Cochinita Pibil', 'Cerdo cocido a fuego lento en achiote y cítricos, luego desmechado', 6000, 'tacos', true, 5),
('Nopal/Vegetariano', 'Nopal tierno a la plancha con costra de queso, sobre tortilla calientita', 6000, 'tacos', true, 6);

-- TACOMBOS
INSERT INTO products (name, description, price, category, sort_order) VALUES
('Combo 5', '5 tacos a elección (máx. 1 birria sin costo adicional)', 28000, 'tacombos', 1),
('Combo 5 + Totopos', '5 tacos + totopos con guacamole', 32000, 'tacombos', 2),
('Combo 5 + Nachos', '5 tacos + nachos', 40000, 'tacombos', 3),
('Combo 5 Quesabirrias', '5 tacos de birria con costra de queso + caldo', 48000, 'tacombos', 4),
('Combo 5x2 + Totopos', '10 tacos + totopos (máx. 2 birria)', 59000, 'tacombos', 5),
('Combo 5x2 + Nachos', '10 tacos + nachos (máx. 2 birria)', 75000, 'tacombos', 6),
('Combo 5x4', '20 tacos + totopos (máx. 4 birria)', 117000, 'tacombos', 7);

-- QUESADILLAS
INSERT INTO products (name, description, price, category, sort_order) VALUES
('Quesadilla', 'Tortilla de harina, queso mozzarella fundido, DOS proteínas a elección, totopos artesanales y pico de gallo', 22000, 'quesadillas', 1),
('Quesadilla de birria', 'Quesadilla de birria con caldo incluido', 24000, 'quesadillas', 2),
('Combo 2Q', '2 Quesadillas', 42000, 'quesadillas', 3),
('Combo QT', '1 Quesadilla + 3 tacos', 38000, 'quesadillas', 4),
('Combo QN', '1 Quesadilla + Nachos', 42000, 'quesadillas', 5),
('Combo 2QT', '2 Quesadillas + 6 tacos', 73000, 'quesadillas', 6);

UPDATE products SET has_protein_choice = true, max_proteins = 2 WHERE name IN ('Quesadilla', 'Quesadilla de birria');

-- BEBIDAS
INSERT INTO products (name, description, price, category, sort_order) VALUES
('Soda michelada', 'Sabor base + perlas + michelado', 9000, 'bebidas', 1),
('Corona', 'Cerveza Corona 330ml', 8000, 'bebidas', 2),
('Poker', 'Cerveza Poker 330ml', 6000, 'bebidas', 3),
('Águila', 'Cerveza Águila 330ml', 6000, 'bebidas', 4),
('Águila Light', 'Cerveza Águila Light 330ml', 6000, 'bebidas', 5),
('Club Colombia', 'Cerveza Club Colombia 330ml', 7000, 'bebidas', 6),
('Gaseosa 400ml', 'Gaseosa 400ml', 5000, 'bebidas', 7),
('Soda 400ml', 'Soda 400ml', 5000, 'bebidas', 8),
('Agua 400ml', 'Agua 400ml', 4500, 'bebidas', 9),
('Agua con gas 400ml', 'Agua con gas 400ml', 4500, 'bebidas', 10),
('Coca-Cola 1.5L', 'Coca-Cola 1.5L', 12000, 'bebidas', 11),
('Coca-Cola Zero 1.5L', 'Coca-Cola Zero 1.5L', 12000, 'bebidas', 12),
('Agua de Jamaica', 'Agua de Jamaica artesanal', 5000, 'bebidas', 13),
('Michela tu bebida — Tradicional', 'Michelar cualquier bebida, estilo tradicional', 2500, 'bebidas', 14),
('Michela tu bebida — Chamoy y tajín', 'Michelar cualquier bebida con chamoy y tajín', 3500, 'bebidas', 15),
('Cantarito', 'Cóctel de tequila, limón, naranja, toronja, servido michelado con chamoy y tajín', 22000, 'bebidas', 16);

-- ADICIONES
INSERT INTO products (name, description, price, category, sort_order) VALUES
('Guacamole', 'Guacamole artesanal', 2500, 'adiciones', 1),
('Pico de gallo', 'Pico de gallo fresco', 3000, 'adiciones', 2),
('Crema agria', 'Crema agria', 2000, 'adiciones', 3),
('Salsa de queso cheddar', 'Salsa de queso cheddar', 2000, 'adiciones', 4),
('Caldo de Birria', 'Caldo de birria para acompañar', 2000, 'adiciones', 5);
