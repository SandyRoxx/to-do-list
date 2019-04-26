const express= require('express');
const bodyParser= require('body-parser');
const db=require('./db');

let app = express();


let tasks=[];

 app.use(bodyParser.json());
 app.use(bodyParser.text());
 app.use(bodyParser.urlencoded({extended: false }));


 app.use('/',express.static('public'));

 app.post('/add',function(req,res){
     try{ 
        db.insertNode(req.body.task,function(insertedId){
           tasks.push({"_id":insertedId,"task":req.body.task});
            res.send({"_id":insertedId,"task":req.body.task});

        });
     }catch(err){
        console.log(err);
     }
 });

 app.post('/delete',function(req,res){
     try{
        let index = req.body.index;
        let id=req.body.id; 
        tasks.splice(index,1);
        db.deleteNode(id,function(result){
            console.log(result.result);
            res.send(tasks);
        });
     }catch(err){
         console.log(err);
     }
        
 });

 app.post('/update',function(req,res){
     try{
        let id=req.body.id;
        let index = req.body.index;
        let newvalue=req.body.newvalue;
        tasks[index].task=newvalue;
        db.updateNode(id,newvalue,function(result){
            console.log(result.result);
            res.send(tasks);
        });
        
     }catch(err){
         console.log(err);
     } 
 });

 app.get('/data',function(req,res){
     try{
        res.send(tasks);
     }catch(err){
         console.log(err);
         
     }
     
 });

 function refilling(){
    db.getData(function(result){
        tasks=result;    
    });
    
}

 app.listen(5000,function(err){
     try{
        console.log("Connected Successfully to Server on port 5000"); 
        db.connect(function(){
            refilling();
        });

     }catch(err){
         console.log(err);
     }
 });