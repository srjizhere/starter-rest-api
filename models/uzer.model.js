const mongoose = require('mongoose');

const uzerSchema = mongoose.Schema({
    email:String,
    password:String,
    name:String
    
})


const UzerModel = mongoose.model("uzer",uzerSchema);



module.exports = {UzerModel}