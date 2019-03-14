const express = require("express");
const cookieParser = require('cookie-parser')
const app = express();
const PORT = 8080; // default port 8080
const bcrypt = require('bcrypt');

app.set("view engine", "ejs");
app.use(cookieParser())

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {
  b6UTxQ: { shortURL: "b6UTxQ", longURL: "https://www.tsn.ca", userID: "userRandomID" },
  i3BoGr: { shortURL: "i3BoGr", longURL: "https://www.google.ca", userID: "aJ48lW" }
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
  },
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
  for (let user in users) {
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

//Need to update this with bcrypt
const authenticate = (email, password) => {
  const usersArray = Object.values(users)
  for (var user in usersArray) {
    if (usersArray[user].email === email && usersArray[user].password === password) {
      return true;
    }
  }
}

const userURLS = (id) => {
  const urls = [];
  for (var url in urlDatabase)
    if (urlDatabase[url].userID === id) {
      urls.push(urlDatabase[url])
    }
    return urls
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

app.get("/urls", (req, res) => {
  const userId = req.cookies['userid'];
  const currentUser = users[userId];
  const userURLSArr = userURLS(userId);
  let templateVars = { urls: userURLSArr, username: currentUser ? currentUser.email : null }; //if no id then will return null
  res.render("urls_index", templateVars);
})

app.get("/register", (req, res) => {
  const userId = req.cookies['userid'];
  const currentUser = users[userId];
  let templateVars = { username: currentUser ? currentUser.email : null };
  res.render("registration", templateVars);
})

//this loads the urls/new page which has the form to add a new url.
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
 let longURL = urlDatabase[req.params.shortURL].longURL;
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

//this post checks whether the email and password match what is in the database, if so sets the cookie. If not throws an error.
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
  const password = bcrypt.hashSync(req.body.password, 10);

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
