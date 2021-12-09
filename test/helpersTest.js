const { assert } = require('chai');

const checkDuplicateEmail  = require('../helper');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = checkDuplicateEmail("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    console.log(user);
    // Write your assert statement here
    assert.equal(user,true);
  });

  it('should return a user with valid email', function() {
    const user = checkDuplicateEmail("abc@gmail.com", testUsers);
    const expectedUserID = "userRandomID";
    console.log(user);
    // Write your assert statement here
    assert.equal(user,false);
  });
});