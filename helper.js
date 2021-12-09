const checkDuplicateEmail = function(email,users) {
  for (let l in users) {
    if (users[l].email === email) {
      return true;
    }
  }
  return false;
};

module.exports = checkDuplicateEmail;