var mysql = require('mysql');
const cTable = require('console.table');
var inquirer = require('inquirer');



function selectAllProducts(){
    connection.query('SELECT * FROM products', function(err, resp){
        if (err) throw err;
        var values = [];
        for (var i = 0; i < resp.length; i++){
            var value = [resp[i].item_id, resp[i].product_name, resp[i].department_name, `$${resp[i].price}`, resp[i].stock_quantity];

            values.push(value);
            // console.log(`Product: ${resp[i].product_name}`)
        }
        console.log(values);
        console.table(["ID", "Product", "Category", "Price", "Stock"], values);
    })
}

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'California',
    database: 'bamazon'
})

connection.connect(function(err){
    if (err) throw err;
    console.log('connected as id ' + connection.threadId);
start();
})

function start(){
    selectAllProducts();

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
        var selection = answer.selectQty;
        console.log(selection);
        connection.query('SELECT * FROM products', function(err, resp){
            console.log(resp[selection - 1].stock_quantity);
            if (err) throw err;
            if(selection <= resp[selection - 1].stock_quantity){
                //update stock quantity
                console.log(typeof(resp[selection-1].stock_quantity))
                connection.query("UPDATE products SET ? WHERE ?",
                    [
                        { stock_quantity: (resp[selection - 1].stock_quantity - answer.selectQty)},
                    { item_id: answer.selectID}
                    ])

            } else{
                console.log("Insufficient quantity!")
            }
        })
        


    })
}