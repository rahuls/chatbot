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
    //Redirect to the app if user tries to reach the endpoint
    return res.status(301).redirect('https://rahuls.github.io/app');
});


router.get('/:surl', (req, res) => {
    //Get the long URL for the short URL
    let path=req.originalUrl;
    path=path.slice(1);
    
    let sql = 'select lurl from urls where surl = ?';
    db.get(sql,[path],(err,row) => {
      if(err){
        return console.error(err.message);
      }
      if(row){
        return res.status(301).redirect(setHttp(row.lurl));
      }else{
        return res.status(400).json("The short url doesn't exists in our system.");
      }
    });
});


router.post('/', (req, res) => {
    let status = req.body.status;
    //Create an order and insert into the table
    if(status==1){
        let orderid = randomstring.generate({
            length: 4,
            charset: 'numeric'
        });
        let dstatus='Not Delivered. Under Preparation';
        let itemid = req.body.itemid;
        let sql = "INSERT INTO orders(orderid,itemid,dstatus) VALUES('"+orderid+"','"+itemid+"','"+dstatus+"')";
        db.run(sql)
        return res.json({'message': [{
            "text" : `"Order Succesful! Your order id is ${orderid}"`
        }]});
    }
    else if(status==2){ //The user want to check for details
        let orderid = req.body.orderid;
        let sql = 'select dstatus from orders where orderid = ?';
        db.get(sql,[orderid],(err,row) => {
            if(err){
              console.log(err.message);
            }
            if(row){
                return res.json({'message': [{
                    "text" : `"Your order delivery status is ${row.dstatus}"`
                }]});
            }else{
                return res.json({'message': [{
                    "text" : `"Sorry your Order ID is Invalid"`
                }]});
            }
          });
    }
});

router.get('*',(req,res) => {
    //If user tries to reach an unknown path 
    return res.send('Invalid URL');
})

export default router;