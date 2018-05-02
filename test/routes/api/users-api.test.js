var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var expect = chai.expect;
var UserService = require('../../../routes/userService');
var Mongoose = require('mongoose').Mongoose;
var mongoose = new Mongoose();
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);
var server = require('../../../app');

chai.use(chaiHttp);

//**** Mock data
var user1 = {
				username: "TEST1",
				fullName: "Test User 1",
				isAdmin: false,
				password: "Password1"
			};
var user2 = {
				username: "TEST2",
				fullName: "Test User 2",
				isAdmin: true,
				password: "Password2"
			};			


describe('User API', function () {

	//**** Test setup
	
	//Create a mock mongodb server
	before(function (done) {
		mockgoose.prepareStorage().then(function() {
			mongoose.connect('mongodb://localhost/test2', function(err) {
				done(err);
			});
		});
	});
	
	//Before each test, delete any created data
	beforeEach(function (done) {
		UserService.deleteAll().then(()=> {
			setTimeout(done, 400); //give DB time to refresh
		});
	});
	
	//**** Test helpers
	function givenAUser(callback) {
		UserService.createUser(user1).then(callback);
	}
	
	function givenUsers(callback) {
		UserService.createUser(user2).then((result)=>{
			UserService.createUser(user1).then(callback);
		});
	}
	
	
	//**** Tests
	describe('API Tests', function () {
		
		it('is able to create a user', function (done) {
			
			chai.request(server)
				.post('/')
				.send(user1)
				.end((err, res) => {
					res.should.have.status(201); //verify that the REST endpoint returned a 201 CREATED response.
					res.body.should.be.a('object'); //verify that the REST endpoint returned body.
					expect(res.body).to.have.property('username').equal(user1.username); //Verify that it created the user we wanted to create
					done();
				});
		
		});
		
		it('is able to get a user', function (done) {
			givenAUser((createResult)=> {
				chai.request(server)
				.get('/'+ user1.username)
				.end((err, res) => {
					res.should.have.status(200); //verify that the REST endpoint returned a 200 OK response.
					res.body.should.be.a('object'); //verify that the REST endpoint returned body.
					expect(res.body).to.have.property('username').equal(user1.username); //Verify that it got the user we wanted to get
					done();
				});
			});
		});
		
		
		it('is able to get all users', function (done) {
			givenUsers((createResult)=> {
				chai.request(server)
				.get('/')
				.end((err, res) => {
					res.should.have.status(200); //verify that the REST endpoint returned a 200 OK response.
					res.body.should.be.a('array'); //verify that the REST endpoint returned body.
					expect(res.body).to.have.lengthOf(2); //Verify that it got the users we wanted to get
					done();
				});
				
			});
			
		});
		
		
		it('is able to udpate a user', function (done) {
			givenAUser((createResult)=> {
				var updatedName = "Ralph";
				createResult.fullName = updatedName;
				chai.request(server)
				.put('/'+ user1.username)
				.send(createResult)
				.end((err, res) => {
					res.should.have.status(200); //verify that the REST endpoint returned a 200 OK response.
					res.body.should.be.a('object'); //verify that the REST endpoint returned body.
					expect(res.body).to.have.property('fullName').equal(updatedName); //Verify that it update the user we wanted to update
					done();
				});
			});
		});
		
		
		it('is able to delete a user', function (done) {
			
			givenAUser((createResult)=> {
				chai.request(server)
				.delete('/'+ user1.username)
				.end((err, res) => {
					res.should.have.status(200); //verify that the REST endpoint returned a 200 OK response.
					chai.request(server)
					.get('/'+ user1.username)
					.end((err, res) => {
						res.should.have.status(404); //verify that the REST endpoint returned a 404 NOT FOUND now that it's been deleted.
						done();
					});	
				});
			});
		});
	});
	
});

