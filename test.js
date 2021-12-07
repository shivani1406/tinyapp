const generateRandomString = function() {
  let arr = "1234567890abcdefghijklmnopqrstuvwx".split('');
  let len = 6;
  let ans = "";
  for (let i = len; i > 0; i--) {
    ans += arr[Math.floor(Math.random() * arr.length)];
  }
  console.log("a");
  console.log(ans);
  return ans;
  }
  generateRandomString();