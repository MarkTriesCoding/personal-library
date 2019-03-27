/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        
      });
    done();
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */
  var title;
  var testbookid
  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({title:'My Test Title'})
          .end(function(err,res){
            assert.equal(res.status,200);
            assert.property(res.body[0],'commentcount','books in array should contain comment count');
          
            assert.property(res.body[0],'title','books in array should contain title ');
          
            assert.property(res.body[0],'_id','books in array should contain _id');
            testbookid = res.body[0]._id;

        })
        done();
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({})
          .end(function(err,res){
            assert.equal(res.status,200);
            assert.equal(res.text,'missing title');
            
        })
        done();
        //done();
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .end(function(err,res){
            assert.equal(res.status,200);
            assert.isArray(res.body[0]);
            assert.property(res.body[0],'commentcount','Books should have property commentcount');
            assert.property(res.body[0],'title','Books should have property title');        
            assert.property(res.body[0],'_id','Books should have property _id');
            assert.equal(res.body.title, 'My test book');
        })      
        done();
        //done();
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
          .get('api/books/1234')
        
          .end(function(err,res){
            assert.equal(res.status,200);
            assert.equal(res.text,'no book with that id');
        })
        done();
        //done();
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .get('/api/books/'+testbookid)
          .end(function(err,res){
            assert.equal(res.status,200);
            assert.property(res.body,'title','book has title');
            assert.property(res.body,'comments','book has comments')
            assert.isArray(res.body.comments);
            assert.property(res.body,'_id','book has valid id');
            assert.equal(res.body._id,testbookid);
        })
        done();
        //done();
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .post('/api/books/'+testbookid)
          .send({comment:"My comment"})
          .end(function(err,res){
            assert.equal(res.status,200);
            assert.property(res.body,'title','book has title')
            assert.property(res.body,'comments','book has comments')
            assert.property(res.body,'_id','book has id')
            assert.isArray(res.body.comments,'comments should be an array');
            assert.include(res.body.comments,'My comment','comment should be included in comments property');
        })
        done();
        //done();
      });
      
    });

  });

});
