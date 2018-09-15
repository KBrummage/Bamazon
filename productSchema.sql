DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INT AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(30) NOT NULL, 
	department_name VARCHAR(30) NOT NULL,
	price INTEGER NOT NULL,
	stock_quantity INTEGER(10),
	PRIMARY KEY (item_id)
);

SELECT * FROM products;

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Full Body Groot Costume", "Costumes", 2500.00, 3);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Rubik's Cube Lamp", "Work Gifts", 136.14, 8);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Tesla Surfboard", "Musk Toys", 1500.00, 72);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Dragon's Breath Chili Peppers", "Home & Garden", 9.99, 20);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Snorlax Bean Bag Chair", "Furniture", 147.99, 28);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Reusable Toilet Paper", "Bathroom Accessories", 7.99, 462);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Fidget Spinner Knife", "Work Gifts", 59.95, 939);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("4TFY Lifetime VPN Access", "Work Gifts", 89,00, 10000);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Shopping Cart Baby Hammock", "Baby Accessories", 55.95, 55);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Ultrasonic Electric Toothbrush", "Toiletries", 49.98, 139);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("007 Aston Martin DB5", "Automobiles", 3500000, 1);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Mezmoglobe Kinetic Toy", "Work Gifts", 27.00, 178);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Electric Skateboard", "Outdoor", 1499.00, 13);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Self-Balancing Electric Skateboard", "Outdoor", 1499.00, 13);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Murphy Cabinet Bed", "Furniture", 1997.00, 3);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Sriracha Seasoning Sticks", "Kitchen", 12.99, 119)