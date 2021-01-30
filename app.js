const express=require('express')
const app=express()
const port=3000
const cors = require('cors')
const fileupload=require('express-fileupload')
const fs = require('fs')
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');

const mongoose = require('mongoose');
const Database = require('./models/database');

app.use(fileupload());



app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

var url = "mongodb://localhost:27017/disk"
mongoose.connect(url, {useNewUrlParser:true, useUnifiedTopology:true}).then((db)=>{

    console.log("Successfully Connected to Database Disk");
},(err)=>{
    console.log("Something went wrong.");
})


app.get('/',(req, res) => {

    res.sendFile(__dirname+ '/index.html')
})
app.post('/upload',(req, res) => {

    if(req.files)
    {
        console.log("File Availabled");
        var file = req.files.filename;
        var filename = file.name;
        console.log(filename);

        file.mv('./uploads/'+filename, (err)=>{
            if(err)
            {
                res.statusCode = 200;
                res.contentType("application/json");
                res.json({
                    "status":"Failed",
                    "file_uploaded":"File could not be uploaded"
                });
            }
        })


        fs.readFile('./uploads/'+filename, 'utf8', (err, data)=>{

            if(err)
            {

            }
            else
            {
                var allLines = data.split("\n");
                for(var  i = 1; i< allLines.length; i++)
                {
                    var currentLine = allLines[i];
                    var allValuesInCurrentLine = currentLine.trim().split(",");
                    if(currentLine != '')
                    {
                        var jsonObjectForModel = {
                            'rollNo':allValuesInCurrentLine[0],
                            'firstName':allValuesInCurrentLine[1],
                            'lastName':allValuesInCurrentLine[2],
                            'cgpa':allValuesInCurrentLine[3],
                            'degree':allValuesInCurrentLine[4]

                        }
                        console.log(jsonObjectForModel)

                        Database.create(jsonObjectForModel).then((data)=>{
                            console.log("Object Created Successfully. To see the added values please open /values endpoint");
                        }, (err)=>{
                            console.log(err.message);
                        });
                    }
                }
            }

        })


        res.statusCode = 200;
        res.contentType("application/json");
        res.json({
            "status":"Success",
            "file_uploaded":filename
        })
    }

})



app.get("/values", (req, res, next)=>{



    Database.find({}).then((db)=>{
        res.contentType("application/json");
        res.statusCode = 200;
        res.json(db);

    })
})


app.listen(port,()=> {
    console.log(`App listening at  http://localhost:${port}`)

})
