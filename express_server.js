const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bcrypt = require('bcryptjs');
app.set("view engine", "ejs");

const checkDuplicateEmail = require('./helper');

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
// Middleware
// Makes cookie readable / parses
const cookieParser = require('cookie-parser')
app.use(cookieParser());
const cookieSession = require('cookie-session')
app.use(
  cookieSession({
    name: "session",
    keys: ["I like potatoes, cheese and gravy", "key"],
  })
);


// ----- Random string generation function ----------
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



// const urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };

// ------------- Objects declaration --------------
const urlDatabase = {
  b6UTxQ: {
      longURL: "https://www.tsn.ca",
      userID: "aJ48lW"
  },
  i3BoGr: {
      longURL: "https://www.google.ca",
      userID: "aJ48lW"
  }
};

const users = { 
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
}

// ------------------ General Routes ----------------------

app.get("/", (req, res) => {
  res.send("Hello!");
});

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });
app.get("/urls", (req, res) => {
  const filtered = {};
  // for (let i = 0; i < Object.keys(urlDatabase).length; i++) {
  //   console.log(req.cookies["user_id"]);
  //   console.log(Object.keys(urlDatabase)[i]);
  //   if (req.cookies["user_id"] === Object.keys(urlDatabase)[i]) {
  //     let str = Object.keys(urlDatabase)[i];
  //     filtered[req.cookies["user_id"]] = urlDatabase[req.cookies["user_id"]];
  //   }
    
  // }
  const templateVars = { urls: urlDatabase ,  user_detail : users , userid : req.session.user_id};
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
    
     user_detail : users , userid : req.session.user_id
    // ... any other vars
  };
  res.render("urls_new", templateVars);
});
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {  shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL  , user_detail : users , userid : req.session.user_id};
  res.render("urls_show", templateVars);
});


app.post("/urls", (req, res) => {
  // console.log(req.body);  // Log the POST request body to the console
  // res.send("Ok");         // Respond with 'Ok' (we will replace this)
  const templateVars = {
    
    user_detail : users
    , userid : req.session.user_id
    // ... any other vars
  };
  let str = generateRandomString();
  //console.log(str);
  //console.log(req.body);
  let temp = {};
  
  if (templateVars.userid === undefined) {
    res.render("login",templateVars);
  } else {
    temp["longURL"] = req.body["longURL"];
  temp["userID"] = req.session.user_id;
  urlDatabase[str] = temp;
  console.log(temp);
  console.log(urlDatabase);
    res.redirect(`/urls/${str}`);
  }
  
});

app.get("/u/:shortURL", (req, res) => {
 
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

app.post("/urls/:shortURL", (req, res) => {
  // console.log("Hello");
  // const shortURL = req.params.shortURL;
  // console.log(urlDatabase[shortURL]);
  const templateVars = {
    
    user_detail : users
    , userid : req.session.user_id
    // ... any other vars
  };
  if (templateVars.userid === undefined) {
    res.render("login",templateVars);
  } else {
    // if (req.cookies["user_id"] === urlDatabase[req.params.shortURL].userID) {
      urlDatabase[req.params.shortURL].longURL = req.body["longURL"];
      // console.log(req.body["longURL"]);
      res.redirect('/urls');
    // }
    
  }
  
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  const templateVars = {
    
    user_detail : users
    , userid : req.session.user_id
    // ... any other vars
  };
  if (templateVars.userid === undefined) {
    res.render("login",templateVars);
  } else {
    // if (req.cookies["user_id"] === urlDatabase[shortURL].userID) {
      delete urlDatabase[shortURL];
      res.redirect('/urls');
    // }
  
  }
});

// ------------ Login Routes --------------------

app.post("/login1", (req, res) => {
  // res.cookie('username', req.body["username"]);

  res.redirect('/register');
});

app.get("/logout", (req, res) => {
  //res.clearCookie("username");
  //res.clearCookie("user_id");
  delete req.session.user_id;
  res.redirect('/urls');
});

app.get("/login", (req, res) => {
  const templateVars = {  user_detail : users, userid : req.session.user_id, check_email : false};
   res.render('login',templateVars);
});

app.post("/login", (req, res) => {
  const templateVars = {  user_detail : users, userid : req.session.user_id, check_email : false};

  let user = req.body["email"];
  let password = req.body["password"];

  for (let l in users) {
    if (users[l].email === user) {
     // if (users[l].password === password) {
       if (bcrypt.compareSync(password, users[l].password )) {
        // res.cookie('user_id', users[l].id);
        req.session.user_id = users[l].id;
        res.redirect("/urls");
      } else {
        res.status(403).send("No such user");
      }
    }
  }
  res.status(403).send("No such user");
});

// ------------- Registration Routes -----------------

app.get("/register", (req, res) => {
  let checkemail = false;
  res.cookie('check_email',false);
  const templateVars = {  user_detail : users, userid : req.session.user_id , check_email : false};
  res.render("register",templateVars);
 });
 
 app.post("/register", (req, res) => {
  let check_email = checkDuplicateEmail(req.body["email"],users);
   
   if (check_email) {
    const templateVars = {  user_detail : users, 
      userid : req.session.user_id
       , check_email : true};
    //  console.log(check_email);
     res.render("register",templateVars);
   } else {
    if(req.body["email"] === '' || req.body["password"] === '') {
      res.redirect("*");
    } else {
     let id = generateRandomString();
     let user = req.body["email"];
     let password = req.body["password"];
     const hashedPassword = bcrypt.hashSync(password, 10);
     users[id] = {"id" : id,"email" : user,"password" : hashedPassword};
    //  res.cookie('user_id', id);
    req.session.user_id = id;
     console.log(users);
     res.redirect("/urls");
  
    }
   }
  
   
 });
 // 404
app.get('*',(req,res)=>{
  res.status(404);
  res.render('404');
});

 app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
 });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});