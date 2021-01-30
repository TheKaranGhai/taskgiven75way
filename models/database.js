const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dbSchema = new Schema({

    rollNo:{
       type:Number,
        required:true
    },
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    cgpa:{
        type:Number,
        required:true
    },
    degree:{
        type:String,
        required:true,
        enum:["BCA","MBA","MCA"]
    }

}, {timestamps:true});

const Database = mongoose.model('database', dbSchema);
module.exports = Database;
