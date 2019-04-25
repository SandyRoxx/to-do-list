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
        tasks.push(req.body.val);
        
        db.insertNode(req.body.val,function(result){
            res.send(req.body.val);
        });
     }catch(err){
        console.log(err);
     }
 });

 app.post('/delete',function(req,res){
     try{
        let index = req.body.index; 
        tasks.splice(index,1);
        db.deleteNode(tasks[index],function(result){
            res.send(tasks);
        });
     }catch(err){
         console.log(err);
     }
        
 });

 app.post('/update',function(req,res){
     try{
        let index = req.body.index;
        let oldvalue= req.body.oldvalue;
        let newvalue=req.body.newvalue;
        tasks[index]=newvalue;
        db.updateNode(oldvalue,newvalue,function(result){
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
        result.forEach(function(i){
            tasks.push(i.task);
        })
    })
    
}

 app.listen(5000,function(err){
     try{
        console.log(" Server on port 5000"); 
        db.connect(function(){
            refilling();
        });

     }catch(err){
         console.log(err);
     }
 });