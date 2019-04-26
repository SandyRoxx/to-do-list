const mongodb = require('mongodb');
const MongoClient=mongodb.MongoClient;

const url = 'mongodb://localhost:27017';
let collection = '';
const dbName = 'todolist';

function connect(cb){
    MongoClient.connect(url,{ useNewUrlParser: true },function(err,client){
        if(err){
            console.log(err);
        }else{
            console.log("Connected Successfully to Database");
            const db=client.db(dbName);
            collection=db.collection('todocollection');
            cb();
        }    
    });
}
function insertNode(task,cb){
    collection.insertOne({task:task},function(err,result){
        if(err){
            console.log(err);
        }else{
            cb(result.insertedId);
        }  
    });
}
function deleteNode(id,cb){
    console.log(id);
    collection.deleteOne({_id:new mongodb.ObjectID(id)},function(err,result){
        if(err){
            console.log(err);
        }else{
            cb(result);
        }
    });
}
function updateNode(id,newval,cb){
    collection.updateOne({_id:new mongodb.ObjectID(id)},{$set:{task:newval}},function(err,result){
        if(err){
            console.log(err);
        }else{
            cb(result);
        }
    });
}
function getData(cb){

    collection.find({}).toArray(function(err,result){
        if(err){
            console.log(err);
        }else{
            cb(result); 
        }  
    });
}

module.exports={
    connect,
    insertNode,
    deleteNode,
    updateNode,
    getData
}