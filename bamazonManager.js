var mysql = require('mysql');
const cTable = require('console.table');
var inquirer = require('inquirer');
var keys = require('./keys.js');

var connection = mysql.createConnection(keys);

connection.connect(function (err) {
  if (err) throw err;
  console.log('connected as id ' + connection.threadId);
  start();
})

function start() {
  inquirer
    .prompt([{
      name: 'selectOption',
      type: 'rawlist',
      message: 'Select option:',
      choices: ['Products for Sale', 'View Low Inventory', 'Update Inventory']
    }])
    .then(function (answer) {
      var choice = answer.selectOption;
      switch (choice) {
        case 'View Low Inventory':
          console.log('View Low Inventory');
          //view low inventory
          viewLow();
          break;

        case 'Products for Sale':
          console.log('Products for Sale');
          //view products for sale
          viewProducts();
          break;

        case 'Update Inventory':
          console.log('Update Inventory - add stuff, update stuff, etc...');
          //new prompt to allow for stuff to happen.
          updateInventory();
      }
    })
}


function viewProducts() {
  connection.query('SELECT * FROM products', function (err, resp) {
    if (err) throw err;
    var values = [];
    for (var i = 0; i < resp.length; i++) {
      var record = resp[i];
      var value = [record.item_id, record.product_name, record.department_name, `$${record.price}`, record.stock_quantity];
      values.push(value);
    }
    console.table(['ID', 'Product', 'Category', 'Price', 'Stock'], values);
  })
}


function viewLow() {
  connection.query('SELECT * FROM products', function (err, resp) {
    if (err) throw err;
    var values = [];
    for (var i = 0; i < resp.length; i++) {
      var record = resp[i];
      if (record.stock_quantity < 6) {
        var value = [record.item_id, record.product_name, record.department_name, `$${record.price}`, record.stock_quantity];
        values.push(value);
      }
    }
    console.log("________Low Inventory________");
    console.table(['ID', 'Product', 'Category', 'Price', 'Stock'], values);
  })
}
function updateInventory() {
  inquirer
    .prompt([{
      name: 'updateInventory',
      type: 'rawlist',
      message: 'Update Inventory',
      choices: ['Add To Stock Quantity', 'Add New Product', 'Remove Product']
    }])
    .then(function (answer) {
      var choice = answer.updateInventory;
      switch (choice) {
        case 'Add To Stock Quantity':
          console.log('Add To Stock Quantity');
          addToStock();
          break;
        case 'Add New Product':
          console.log("Add New Product");
          addNewProduct();
          break;
      }
    })
}

function addToStock() {
  

  let promise = new Promise(function(resolve, reject){
    // viewProducts();
    resolve();
  });

  promise
  .then(function () {
    viewProducts();
    inquirer
        .prompt([{
          name: "selectID",
          type: 'input',
          message: 'Select product id you would like to update quantity of'
        },
        {
          name: 'selectQty',
          type: 'input',
          message: 'Quanity to add to stock'
        }])
        .then(function (answer) {
          var item = answer.selectID;
          var itemDB = "";
          var quantityDB;
          var quantity = answer.selectQty;

          connection.query('SELECT * FROM products', function (err, resp) {
            if (err) throw err;
            itemDB = resp[item - 1].item_id;
            quantityDB = resp[item - 1].stock_quantity;
          });

          connection.query('UPDATE products SET ? WHERE ?',
            [
              { stock_quantity: quantityDB + quantity },
              { item_id: itemDB }
            ])
        })
    // }
  // )
  })

    }
