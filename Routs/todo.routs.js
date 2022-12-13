const express = require('express');

const {TodoModel} = require("../models/todo.model")
const todoRouter = express.Router();
require('dotenv').config();
todoRouter.get("/",async(req,res)=>{
    const userID = req.body.userID
    console.log(userID);
    const todo  = await TodoModel.find({userID})
    console.log(todo)
    res.send(todo)
    
})


todoRouter.post("/create", async(req,res)=>{
    const payload = req.body

    try{
        const new_todo = new TodoModel(payload);
        await new_todo.save()
        res.send({"msg":"todo created"})
    }catch(err){
        console.log(err);
        res.send({"msg":"something went wrong"});
    }
 
});

todoRouter.patch("/update/:todoID",async(req,res)=>{
    const todoID = req.params.todoID;
    const userID  = req.body.userID;
           const todo  = await TodoModel.findOne({_id:todoID})
           if(userID!=todo.userID){
               res.send({"msg":"not authorized"})
            }else{
                const payload = req.body;
                await TodoModel.findByIdAndUpdate({_id:todoID},payload)
                res.send({"msg":"todo updated sucessfully"});

            }
            

  
        })
        

        todoRouter.delete("/delete/:todoID",async(req,res)=>{
            const todoID = req.params.todoID;
            const userID = req.body.userID;
            const todo  = await TodoModel.findOne({_id:todoID})
            if(userID!=todo.userID){
                res.send({"msg":"not authorized"})
             }else{
    await TodoModel.findByIdAndDelete({_id:todoID})
    res.send({"msg":"todo deleted sucessfully"});
             }
})



module.exports = {todoRouter};