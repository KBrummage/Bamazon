var mysql = require('mysql');
const cTable = require('console.table');
var inquirer = require('inquirer');
var keys = require('./keys.js');


function selectAllProducts(){
    connection.query('SELECT * FROM products', function(err, resp){
        if (err) throw err;
        var values = [];
        for (var i = 0; i < resp.length; i++){
            var value = [resp[i].item_id, resp[i].product_name, resp[i].department_name, `$${resp[i].price}`, resp[i].stock_quantity];

            values.push(value);
            // console.log(`Product: ${resp[i].product_name}`)
        }

        console.table(["ID", "Product", "Category", "Price", "Stock"], values);
    })
}

var connection = mysql.createConnection(keys)

connection.connect(function(err){
    if (err) throw err;
    console.log('connected as id ' + connection.threadId);
    selectAllProducts();

})

start();

function start(){
   

    inquirer
    .prompt([{
        name: "selectID",
        type: 'input',
        message: 'Please select the product id you would like to purchase'
    },
    {   name: 'selectQty',
        type: 'input',
        message: 'Quanity to purchase:'
    }])
    .then(function(answer){
        var selectionQty = answer.selectQty;
        var selectionID = answer.selectID;
        connection.query('SELECT * FROM products', function(err, resp){

            if (err) throw err;
            console.log(selectionQty + "<-- quantity selected");
            console.log(selectionID + "<--selectionID");
            console.log(resp[selectionID-1].stock_quantity+ "<--resp selection stock quantity");
            if(selectionQty <= resp[selectionID-1].stock_quantity){
                //update stock quantity
                connection.query("UPDATE products SET ? WHERE ?",
                    [
                        { stock_quantity: (resp[selectionID-1].stock_quantity - answer.selectQty)},
                    { item_id: answer.selectID} 
                    ])
                console.table([
                    {Amount: `${answer.selectQty} qty.`,
                    Product: resp[selection - 1].product_name,
                    Price: `$${resp[selection - 1].price}`,Total: `$${resp[selection-1].price*answer.selectQty}`}
                ])
            } else{
                console.log("Insufficient quantity!")
            }
        })
        


    })
}