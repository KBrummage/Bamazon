var mysql = require('mysql');
const cTable = require('console.table');
var inquirer = require('inquirer');
var keys = require('./keys.js');
var Promise = require('promise');
var connection = mysql.createConnection(keys);


function selectAllProducts() {
    connection.query('SELECT * FROM products', function (err, resp) {
        if (err) throw err;
        var values = [];
        for (var i = 0; i < resp.length; i++) {
            var value = [resp[i].item_id, resp[i].product_name, resp[i].department_name, `$${resp[i].price}`, resp[i].stock_quantity];

            values.push(value);
            // console.log(`Product: ${resp[i].product_name}`)
        }

        console.table(["ID", "Product", "Category", "Price", "Stock"], values);
    })
}


connection.connect(function (err) {
    if (err) throw err;
    console.log('Welcome to Bamazon.com!!');
    menu();
})



async function start() {
    await viewProductsPromise();

    inquirer
        .prompt([{
                name: "selectID",
                type: 'input',
                message: 'Please select the product id you would like to purchase'
            },
            {
                name: 'selectQty',
                type: 'input',
                message: 'Quanity to purchase:'
            }
        ])
        .then(function (answer) {
            let productID = answer.selectID;
            var purchaseQTY = parseInt(answer.selectQty);

            connection.query('SELECT * FROM products', function (err, resp) {

                if (err) throw err;
                console.log(purchaseQTY + "<-- quantity selected");
                console.log(typeof (purchaseQTY) + "<- typeof purchaseQTY")
                console.log(productID + "<--productID");
                let stockQTY = resp[productID - 1].stock_quantity;
                console.log(typeof (stockQTY) + "<--type of stockQTY");
                console.log(stockQTY + "<--resp selection stock quantity");
                if (purchaseQTY <= stockQTY) {
                    //update stock quantity
                    connection.query("UPDATE products SET ? WHERE ?",
                        [{
                                stock_quantity: (stockQTY - purchaseQTY)
                            },
                            {
                                item_id: answer.selectID
                            }
                        ])
                    console.log(" *** Your Receipt *** ")
                    console.table([{
                        Amount: `${answer.selectQty} qty.`,
                        Product: `${resp[productID - 1].product_name}`,
                        Price: `$${resp[productID - 1].price}`,
                        Total: `$${resp[productID-1].price*purchaseQTY}`
                    }])
                    menu();
                } else {
                    console.log("Insufficient quantity!")

                }
            })


            menu();
        })
}

function menu() {
    inquirer
        .prompt([{
            name: 'menuOption',
            type: 'rawlist',
            message: 'Choose from the options below',
            choices: ['viewProducts', 'makePurchase', 'quit']
        }])
        .then(function (answer) {
            let choice = answer.menuOption;
            switch (choice) {
                case 'viewProducts':
                    startOver();
                    break;
                case 'makePurchase':
                    start();
                    break;
                case 'quit':
                    console.log("Goodbye!");
            }
        })
}

function viewProductsPromise() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM products', function (err, resp) {
            if (err) throw err;
            var values = [];
            for (var i = 0; i < resp.length; i++) {
                var record = resp[i];
                var value = [
                    record.item_id,
                    record.product_name,
                    record.department_name,
                    `\$${record.price}`,
                    record.stock_quantity
                ];
                values.push(value);
            }
            console.table(['ID', 'Product', 'Category', 'Price', 'Stock'], values);
            resolve(values);

        })
    });
}

async function startOver() {
    await viewProductsPromise();
    menu();
}