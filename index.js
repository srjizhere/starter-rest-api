const express = require('express');
const app = express()
app.use(cors())

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config()

const {connection} = require("./config/db")
const {UzerModel} = require("./models/uzer.model")
const { authenticate } = require('./middelwares/authonticate');

const {todoRouter} = require("./Routs/todo.routs");




app.use(express.json());
app.get("/",(req,res)=>{
    res.send("Welcome")
})
app.post("/signup",async(req,res)=>{

    const {email,password,name}  =  req.body;
    const userpresent = await UzerModel.findOne({email:email});
    console.log(userpresent);
    if(userpresent){
        res.send({"msg":"try login user already there"})
    }
    else{
try{
    bcrypt.hash(password,5, async function(err,hash){
        
        const user   = new UzerModel({email,password:hash,name});
        await user.save()
        res.send({"msg":"signup succesfully"});

    });
}catch(err){
    res.send({"msg":"please try again later"})
    console.log(err);
}
    }
});

app.get("/uzers",async(req,res)=>{

        const uzer = await UzerModel.find()

        res.send(uzer)
})

app.post("/login",async(req,res)=>{
    const {email,password} = req.body;
    
    
    try{
        
        const user =await UzerModel.find({email});
        
        if(user.length>0){
            const hashed_pass = user[0].password;
        bcrypt.compare(password,hashed_pass,function(err,result){
                if(result){
                    const token = jwt.sign({"userID":user[0]._id},process.env.secret_key);
                    res.send({"msg":"login done","token":token})
                }else{
                    res.send({"msg":"login failed"})
                }

        });
        }else{
            res.send({"msg":"login failed"})
        } 
    }catch(err){
        console.log(err);
        res.send({"msg":"login something went wrong"})
    }
});

app.use(authenticate)
app.use("/todo",todoRouter)














app.listen(process.env.port,async()=>{
    try{
        await connection;
        console.log("connected to DB sucessfuly");
    }catch(err){
        console.log("Error in listening");
        console.log(err);
    }
    console.log(`listening on port ${process.env.port}`);
});