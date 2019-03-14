//Am up to replacing the cookie username with cookie id. I've changed the create cookie function to pass the cookie ID instead
//Next I need to replace the cookieusername in the template vars to look up the user based on the cookie ID.
//Possibly I've approached this wrong, so might need to get some help from a mentor tomorrow.


var express = require("express");
var cookieParser = require('cookie-parser')
var app = express();
var PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(cookieParser())

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
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

const addUser = (email, password) => {
  const id = Object.keys(users).length + 1;

  const newUser = {
    id: id,
    email: email,
    password: password
  }

  users[id] = newUser;
}

// Think this also needs to check the password
const emailLookup = (email) => {
  for (var user in users) {
    if (user.email === email) {
      return true
    }
  }
}

//this function looks up the id given the email address.Does this need to be modified to also check the password. See where this is being used.
const emailIDLookup = (email) => {
  const usersArray = Object.values(users)
  for (var user in usersArray) {
    if (usersArray[user].email === email) {
      // console.log(usersArray[user].id)
      return usersArray[user].id
    }
  }
}

const authenticate = (email, password) => {
  const usersArray = Object.values(users)
  for (var user in usersArray) {
    if (usersArray[user].email === email && usersArray[user].password === password) {
      return true;
    }
  }
}

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

/*app.get("/urls", (req, res) => {
  let templateVars = { greeting: 'Hello World' };
  res.render("hello_world", templateVars);
})
*/

//Have changed cookie to userid. Need to check that this is actually working.
//May also need to pass along the user informtion
app.get("/urls", (req, res) => {
  const userId = req.cookies['userid'];
  const currentUser = users[userId];
  let templateVars = { urls: urlDatabase, username: currentUser ? currentUser.email : null }; //if no id then will return null
  res.render("urls_index", templateVars);
})
app.get("/register", (req, res) => {
  const userId = req.cookies['userid'];
  const currentUser = users[userId];
  let templateVars = { username: currentUser ? currentUser.email : null };
  res.render("registration", templateVars);
})

//this loads the urls/new page which has the form.
//Have changed cookie to userid. Need to check that this is actually working.
//May also need to pass along the user informtion
app.get("/urls/new", (req, res) => {
  const userId = req.cookies['userid'];
  const currentUser = users[userId];
  if (currentUser) {
    let templateVars = { username: currentUser ? currentUser.email : null };
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/urls")
  }
});

//this loads the urls/:id pages.
//Have changed cookie to userid. Need to check that this is actually working.
//May also need to pass along the user informtion
app.get("/urls/:shortURL", (req, res) => {
  const userId = req.cookies['userid'];
  const currentUser = users[userId];
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: currentUser ? currentUser.email : null
  };
  // console.log(templateVars);
  res.render("urls_show", templateVars);
})

//this will be used to redirect the short URL to the long URL
app.get("/u/:shortURL" , (req, res) => {
 let longURL = urlDatabase[req.params.shortURL];
 res.redirect(`${longURL}`)
})

//this is used when the form is filled in. It redirects to /url/:shortID
app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomstring()
  const newURL = {
    longURL: longURL,
    userId: req.cookies['userid']
    }
  urlDatabase[shortURL] = newURL;
 res.redirect(`/urls/${shortURL}`);
  // res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.body.shortURL];
  res.redirect("/urls");
});

//do I need to do the Object.keys here?
app.post("/urls/:id", (req, res) => {
  const shortURL = Object.keys(req.body);
  const longURL = Object.values(req.body);
  urlDatabase[shortURL] = longURL;
  res.redirect("/urls")
})

//This is the function I'm trying to replace

/*app.post("/login", (req, res) => {
  const cookieName = Object.keys(req.body);
  const cookieValue = Object.values(req.body);
  res.cookie(cookieName, cookieValue);
  res.redirect("/urls")
});*/

//This is the replacement for the above. Rather than set the cookie as a name. It sets it with the id of the user.
//This should also be checking the password of the user.
app.post("/login", (req, res) => {
  const email = Object.values(req.body)[0];
  const password = req.body.password;
  const authenticated = authenticate(email, password);

  if (authenticated) {
    const id = emailIDLookup(email)
    res.cookie('userid', id);
    res.redirect("/urls")
  } else {
    throw "403: Your email or password is incorrect. Please try again"
  }
})

app.get("/login", (req, res) => {
  const userId = req.cookies['userid'];
  const currentUser = users[userId];
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: currentUser ? currentUser.email : null
  };
  res.render("login", templateVars)
})

app.get("/urls/:shortURL", (req, res) => {
  const userId = req.cookies['userid'];
  const currentUser = users[userId];
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: currentUser ? currentUser.email : null
  };
  // console.log(templateVars);
  res.render("urls_show", templateVars);
})

//this request clears the cookies. Need to check that userid cookie is setting to make sure this is working correctly.
app.post("/logout", (req, res) => {
  res.clearCookie('userid');
  res.redirect("/urls")
})

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if(email && password && !emailLookup(email)) {
  addUser(email, password)
  const id = emailIDLookup(email)
  res.cookie('userid', id);
  res.redirect("/urls");

  } else if (!email || !password) {
    throw "Come on...You need to enter an email and password"
  } else {
    throw "That email is already in the database. Please login"
  }
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
