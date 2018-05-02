var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var UserService = require('../../routes/userService');
var Mongoose = require('mongoose').Mongoose;
var mongoose = new Mongoose();
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);

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


describe('User Service', function () {

	//**** Test setup
	
	//Create a mock mongodb server
	before(function (done) {
		mockgoose.prepareStorage().then(function() {
			mongoose.connect('mongodb://localhost/test', function(err) {
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
	describe('Service Tests', function () {
		
		it('is able to create a user', function (done) {
			UserService.createUser(user1).then((createResult)=> {
				should.exist(createResult); //Verify that there was a returned value
				expect(createResult).to.have.property('username').equal(user1.username); //Verify that it created the user we wanted to create
				done();
			});
			
		});
		
		it('is able to get a user', function (done) {
			givenAUser((createResult)=> {
				UserService.getUser(user1.username).then((getResult)=>{
					should.exist(getResult); //Verify that there was a returned value
					expect(getResult).to.have.property('username').equal(user1.username); //Verify that it got the user we wanted to get
					done();
				});
			});
			
		});
		
		it('is able to get all users', function (done) {
			givenUsers((createResult)=> {
				UserService.getAllUsers().then((getResult)=>{
					should.exist(getResult); //Verify that there was a returned value
					expect(getResult).to.have.lengthOf(2); //Verify that it got all the users we wanted to get
					done();
				});
			});

		});
		
		it('is able to udpate a user', function (done) {
			givenAUser((createResult)=> {
				var updatedName = "Phillip";
				createResult.fullName = updatedName;
				UserService.updateUser(createResult.username, createResult).then((updateResult)=>{
					should.exist(updateResult);	 //Verify that there was a returned value				
					expect(updateResult).to.have.property('fullName').equal(updatedName); //Verify that it update the user we wanted to update
					done();
				});
			});

		});
		
		it('is able to delete a user', function (done) {
			givenAUser((createResult)=> {
				UserService.deleteUser(user1.username).then((deleteResult)=>{
					setTimeout(()=>{
						UserService.getAllUsers().then((getResult)=>{
							should.exist(getResult); //Verify that there was a returned value
							expect(getResult).to.have.lengthOf(0); //Verify that it deleted the user we wanted to delete
							done();
						})}
					, 300);
				});
			});
		});
	});
	
});

