const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const cookieParser = require('cookie-parser')
app.use(cookieParser());

const generateRandomString = function() {
let arr = "1234567890abcdefghijklmnopqrstuvwx".split('');
let len = 6;
let ans = "";
for (let i = len; i > 0; i--) {
  ans += arr[Math.floor(Math.random() * arr.length)];
}
// console.log(ans);
return ans;
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase , username: req.cookies["username"]};
  res.render("urls_index", templateVars);
});
// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });
app.get("/hello", (req, res) => {
  const templateVars = { greeting: 'Hello World!' };
  res.render("hello_world", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
    // ... any other vars
  };
  res.render("urls_new", templateVars);
});
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { username: req.cookies["username"], shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});


app.post("/urls", (req, res) => {
  // console.log(req.body);  // Log the POST request body to the console
  // res.send("Ok");         // Respond with 'Ok' (we will replace this)
  const templateVars = {
    username: req.cookies["username"],
    // ... any other vars
  };
  let str = generateRandomString();
  //console.log(str);
  //console.log(req.body);
  urlDatabase[str] = req.body["longURL"];

  res.redirect(`/urls/${str}`, templateVars);
});

app.get("/u/:shortURL", (req, res) => {
 
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.post("/urls/:shortURL", (req, res) => {
  // console.log("Hello");
  // const shortURL = req.params.shortURL;
  // console.log(urlDatabase[shortURL]);
  urlDatabase[req.params.shortURL] = req.body["longURL"];
  // console.log(req.body["longURL"]);
  res.redirect('/urls');
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect('/urls');
});

app.post("/login", (req, res) => {
  res.cookie('username', req.body["username"]);

  res.redirect('/urls');
});

app.get("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect('/urls');
});

app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
 });
 
 app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
 });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});