const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" },
  different: { longURL: "https://www.google.ca", userID: "something" }
}

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


const userURLS = (id) => {
  const urls = [];
  for (var url in urlDatabase)
    if (urlDatabase[url].userID === id) {
      urls.push(urlDatabase[url])
    }
    return urls
}


userURLS("aJ48lW");
