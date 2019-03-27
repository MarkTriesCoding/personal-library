/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGO_DB = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      MongoClient.connect(MONGO_DB,(err,db)=>{
        //use expect to test for connction error
        expect(err,'database error').to.not.exist;
        db.collection('books').find().toArray((err,data)=>{
          //use expect to test for arrayness
          expect(data).to.be.a('array');
          //use expect to test for existence
          expect(data).to.exist;
          for(var i=0;i< data.length;i++){
            data[i].commentcount = data[i].comments.length;
            delete data[i].comments
          
          }    
          res.json(data);
        })
      })

    
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(function (req, res){
      var title = req.body.title;
    if(!title){
      res.send('Missing title')}
    else{
      expect(title,'posted title').to.be.a('string');
      MongoClient.connect(MONGO_DB,(err,db)=>{
        expect(err,'database error').to.not.exist;
        var doc = {title:title,comments:[]};
        db.collection('books').insert(doc,{w:1},(err,data)=>{
          res.json(data.ops[0]);
        })
        
        
      })
      
    }
      //response will contain new book object including atleast _id and title
    })
    
    .delete(function(req, res){
    MongoClient.connect(MONGO_DB,(err,db)=>{
      expect(err,'database error').to.not.exist;
       db.collection('books').remove();
       res.send('complete delete successful')
    })
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
    var obookid = new ObjectId(bookid)
      
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      MongoClient.connect(MONGO_DB,(err,db)=>{
        expect(err,'database error').to.not.exist;
        db.collection('books').find({_id:obookid}).toArray((err, data)=>{
          expect(err,'database find error').to.not.exist;
  
          if(data.length===0){
          res.send("no book exists")}
          else{
          res.json(data[0]);}
        })
      })
    
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var obookid = new ObjectId(bookid);
      var comment = req.body.comment;
   
    
      MongoClient.connect(MONGO_DB,(err,db)=>{
        expect(err,'database error').to.not.exist;
        
        db.collection('books').findAndModify({
                  "_id":obookid},
                  {},
                  {$push:{comments:comment}},{new: true, upsert:true},
                                             
                                             
                                             
                                             
                  (err,data)=>{
                  expect(err,'database findAndModify error').to.not.exist;
            res.json(data.value);
        })
      })
      //json res format same as .get
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      var obookid = new ObjectId(bookid);
      MongoClient.connect(MONGO_DB,(err,db)=>{
        expect(err,'database error').to.not.exist;
        db.collection('books').findOneAndDelete({
          "_id":obookid
        },(err,data)=>{
          expect(err,'findOneAndDelete error').to.not.exist;
          expect(data,'result error').to.exist;
          res.send('delete successful')
        })
      })
      //if successful response will be 'delete successful'
    });
  
};
