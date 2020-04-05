const express= require('express');
const app=express();

const cors=require('cors');
const bodyParser=require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());
const dbUser=process.env.DB_USER;
const pass=process.env.DB_PASS;
const uri = `mongodb+srv://${dbUser}:${pass}@cluster0-zzeuc.mongodb.net/test?retryWrites=true&w=majority`;


let client = new MongoClient(uri, { useNewUrlParser: true });
//database connection








app.get('/products',(req,res)=>{
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        // perform actions on the collection object
        collection.find().toArray((err,documents)=>{
            if(err){
                console.log(err);
                res.status(500).send({message:err})
            }
            else{
                res.send(documents);
            }
            
        });
      
        client.close();
      });
})

app.get('/product/:key',(req,res)=>{
    const key=req.params.key;

    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        // perform actions on the collection object
        collection.find({key:key}).toArray((err,documents)=>{
            if(err){
                console.log(err);
                res.status(500).send({message:err})
            }
            else{
                res.send(documents[0]);
            }
            
        });
      
        client.close();
      });
});

app.post('/getProductsByKey',(req,res)=>{
    const key=req.params.key;
    const productKeys=req.body;
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        // perform actions on the collection object
        collection.find({key:{$in:  productKeys}}).toArray((err,documents)=>{
            if(err){
                console.log(err);
                res.status(500).send({message:err})
            }
            else{
                res.send(documents);
            }
            
        });
      
        client.close();
      });
});

//post


app.post('/addProduct',(req,res)=>{
    //save to database
    const product=req.body;
    client = new MongoClient(uri, { useNewUrlParser: true });
    console.log(product);
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        // perform actions on the collection object
        collection.insert(product,(err,result)=>{
            if(err){
                console.log(err);
                res.status(500).send({message:err})
            }
            else{
                res.send(result.ops[0]);
            }
            
        });
      
        client.close();
      });
      

    
})


app.post('/placeOrder',(req,res)=>{
    //save to database
    const orderDetail=req.body;
    orderDetail.orderTime= new Date();
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("orders");
        // perform actions on the collection object
        collection.insertOne(orderDetail,(err,result)=>{
            if(err){
                console.log(err);
                res.status(500).send({message:err})
            }
            else{
                res.send(result.ops[0]);
            }
            
        });
      
        client.close();
      });
      

    
})


app.listen(4200,()=> console.log('listening to port 4200'));