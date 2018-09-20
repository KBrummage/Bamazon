var mysql = require('mysql');
const cTable = require('console.table');
var inquirer = require('inquirer');
var keys = require('./keys.js');
var Promise = require('promise');
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
        case 'Products for Sale':
          console.log('Products for Sale');
          //view products for sale
          startOver();
          break;

        case 'View Low Inventory':
          console.log('View Low Inventory');
          //view low inventory
          viewLow();
          break;

        case 'Update Inventory':
          console.log("Update Inventory");
          updateInventory();
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


function viewLow() {
  return new Promise((resolve, reject) => {
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
      resolve(values);
      start();
    })
  })
}

function updateInventory() {
  inquirer
    .prompt([{
      name: 'updateInvent',
      type: 'rawlist',
      message: 'Update Inventory',
      choices: ['Add To Stock Quantity', 'Add New Product', 'Remove Product']
    }])
    .then(function (answer) {
      var choice = answer.updateInvent;
      switch (choice) {
        case 'Add To Stock Quantity':
          console.log('Add To Stock Quantity');
          addToStock();
          break;
        case 'Add New Product':
          console.log("Add New Product");
          addNewProduct();
          break;
        case 'Remove Product':
          console.log('Remove Product');
          removeProduct();
          break;
      }
    })
}

async function addToStock() {

  await viewProductsPromise();
  inquirer.prompt([{
      name: "selectID",
      type: 'input',
      message: 'Select product id you would like to update quantity of'
    },
    {
      name: 'selectQty',
      type: 'input',
      message: 'Quanity to add to stock'
    }
  ]).then(function (answer) {
    var item = answer.selectID;
    var itemDB = "";
    var quantityDB;
    var quantity = answer.selectQty;
    connection.query('SELECT * FROM products', function (err, resp) {
      if (err) throw err;

      itemDB = resp[item - 1].item_id;

      quantityDB = resp[item - 1].stock_quantity;

      connection.query('UPDATE products SET ? WHERE ?', [{
          stock_quantity: (quantityDB + parseInt(quantity))
        },
        {
          item_id: itemDB
        }
      ]);
      viewProductsPromise();
      startOver();
    })
  })
}

function addNewProduct() {
  inquirer
    .prompt([{
        name: 'NameofProduct',
        type: 'input',
        message: "Name of Product"
      },
      {
        name: 'Price',
        type: 'input',
        message: "Price of Product"

      },
      {
        name: 'Department',
        type: 'input',
        message: "Department",
      },
      {
        name: 'Quantity',
        type: 'input',
        message: 'Initial Quantity'
      }
    ]).then(function (answer) {
      var name = answer.NameofProduct;
      var dept = answer.Department;
      var price = parseFloat(answer.Price);
      var quantity = parseInt(answer.Quantity);
      connection.query('SELECT * FROM products', function (err, resp) {
        if (err) throw err;
        var newRow = `INSERT INTO products(product_name, department_name, price, stock_quantity)
      VALUES ('${name}', '${dept}', ${price}, ${quantity})`
        connection.query(newRow, function (err, result) {
          if (err) throw err;
          console.log("******* New Product Entered *******");
          start();
        })
      })

    })
}

async function removeProduct(){
  await viewProductsPromise();
  inquirer
  .prompt([
    {
    name: "RemoveProduct",
    type: 'input',
    message: "Select ID of product to remove"
  }])
  .then(function(answer){
    let id = answer.RemoveProduct;
    let sql = 'DELETE FROM products WHERE item_id = ?';
    connection.query(sql, id, (err, results, fields) => {
      console.log('Deleted Row:', results.affectedRows);
      start();
    })
  })
}

async function startOver() {
  await viewProductsPromise();
  start();
}