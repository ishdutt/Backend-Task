const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser=require("body-parser");



//APP config    
mongoose.connect("mongodb://localhost/rivi",{useUnifiedTopology: true , useNewUrlParser: true});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
//app.use(expressSanitizer());
//app.use(methodOverride("_method"));

mongoose.set("useFindAndModify", false);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("Chal rha hai re DB!!!!!!!!!!!!!");
});

//Mongoose schema
var cabbookingSchema = new mongoose.Schema({
    start:String,
    end:String,
    currentDate:Date
});
var CabRide = mongoose.model("CabRide",cabbookingSchema);

//Routes 
app.get("/",(req,res)=>{
    res.render("main.ejs");
});


app.post("/search",async (req,res)=>{
    //capturing variable 
    await sleep(15000);//adding a 15 sec delay
    let start=req.body.start;
    let end=req.body.end;
    let currentDate=req.body.currentDate;
    let newRide={start:start,end:end,currentDate:currentDate};
    //for adding 15sec pause 
    
    //adding data to DB    
    CabRide.create(newRide,(err,newly)=>{
        if(err)
            console.log(err);

        else
        {
            console.log(newly);
            res.render("Id.ejs",{data:newly});
        }
      
    })   
});

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}


app.get("/ping",(req,res)=>{
    res.render("ping.ejs");
});

app.post("/ping",(req,res)=>{
    //capturing data
    let id=req.body.id;
    //Client Sending the ping continously 
    const util = require('util');
    const exec = util.promisify(require('child_process').exec);

    async function lsExample() {
    const { stdout, stderr } = await exec(`mongo --eval 'db.cabrides.find();' rivi`);
    await sleep(5000);
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
    }
    lsExample();

    
    
    //finding the data..capturing it ...delete it and then send it back to client
    CabRide.findById(id,(err,cab)=>{
        //console.log(cab);
        if(err)
        {
            console.log(err);
            res.send(`THe entered ${id} is incorect `);
        }
            
        else
        {
            //data captured
            let start=cab.start;
            let end=cab.end;
            let currentDate=cab.currentDate;
            let newRide={start:start,end:end,currentDate:currentDate};   
            //deleting the data
            CabRide.findByIdAndRemove(id,(err)=>{
                if(err)
                    console.log(err);
                else
                    res.send(newRide);
            })
        }
    })
})



//listening to correct port
var listener = app.listen(8888, function(){
    console.log('Listening on port ' + listener.address().port); //Listening on port 8888

});