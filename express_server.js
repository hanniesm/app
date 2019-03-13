var express = require("express");
var cookieParser = require('cookie-parser')
var app = express();
var PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(cookieParser())

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

//this function generates the shortURL
function generateRandomstring() {
  return Math.random().toString(36).substr(2,5);
}


app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// app.get("/urls", (req, res) => {
//   let templateVars = { greeting: 'Hello World' };
//   res.render("hello_world", templateVars);
// })

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  res.render("urls_index", templateVars);
})

//this loads the urls/new page which has the form
app.get("/urls/new", (req, res) => {
  let templateVars = { username: req.cookies["username"] };
  res.render("urls_new", templateVars);
});

//this loads the urls/:id pages
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies["username"] };
  console.log(templateVars);
  res.render("urls_show", templateVars);
})

//this will be used to redirect the short URL to the long URL
app.get("/u/:shortURL" , (req, res) => {
 let longURL = urlDatabase[req.params.shortURL];
 res.redirect(`${longURL}`)
})

//this is used when the form is filled in. It redirects to /url/:shortID
app.post("/urls", (req, res) => {
  let longURL = req.body.longURL;
  let shortURL = generateRandomstring()
  urlDatabase[shortURL] = longURL;
  // console.log(urlDatabase)  // Log the POST request body to the console
 res.redirect(`/urls/${shortURL}`);
  // res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.body.shortURL];
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  const shortURL = Object.keys(req.body);
  const longURL = Object.values(req.body);
  urlDatabase[shortURL] = longURL;
  res.redirect("/urls")
})

app.post("/login", (req, res) => {
  const cookieName = Object.keys(req.body);
  const cookieValue = Object.values(req.body);
  res.cookie(cookieName, cookieValue);
  res.redirect("/urls")
});

app.post("/logout", (req, res) => {
  // const cookieName = req.body.username
  // console.log(req.body);
  res.clearCookie("username");
  res.redirect("/urls")
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
