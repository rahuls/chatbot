import express from 'express';
import 'dotenv/config.js';
import randomstring from 'randomstring'; //generating a random string
import sqlite3 from  'sqlite3'; 
const router = express.Router();

//Connecting to database
let db=new sqlite3.Database('./food.db',(err) => {
     if(err){
        console.log('Error connecting to DB');
     }
     console.log('Connected to database');
});

router.get('/', (req, res) => {
    //If user opens the endpoint in browser
    res.send(`Hi! This is an API endpoint for chatbot's database`);
    return res;
    
});

router.post('/', (req, res) => {
    let status = req.body.status; //This is used to check whether user wants to place an 
    //order or to check for delivery status
    
    if(status==1){
        //The user wants to place an order
        let orderid = randomstring.generate({
            length: 4,
            charset: 'numeric'
        });
        let dstatus='Not Delivered. Under Preparation';
        let itemid = req.body.itemid;
        let sql = `INSERT INTO orders(orderid,itemid,dstatus) VALUES('${orderid},${itemid},${dstatus}');`
        
        db.run(sql)
        return res.json({'messages': [{
            "text" : `Order Succesful! Your order id is ${orderid}`
        }]});
    }
    else if(status==2){ //
        //The user want to check for delivery status
        let orderid = req.body.orderid;
        let sql = 'SELECT dstatus FROM orders WHERE orderid = ?';
        db.get(sql,[orderid],(err,row) => {
            if(err){
              console.log(err.message);
            }
            if(row){
                return res.json({'messages': [{
                    "text" : `Your order delivery status is ${row.dstatus}`
                }]});
            }else{
                return res.json({'messages': [{
                    "text" : `Sorry your Order ID is Invalid`
                }]});
            }
        });
    }
});

router.get('*',(req,res) => {
    //If there is a request to a path 
    return res.json({
        'message' : `Path doesn't exists`
    });
})

export default router;

// https://nameless-hollows-14750.herokuapp.com