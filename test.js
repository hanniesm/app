
const urlDatabase = {
  b6UTxQ: { shortURL: "b6UTxQ", longURL: "https://www.tsn.ca", userID: "3" },
  i3BoGr: { shortURL: "i3BoGr", longURL: "https://www.google.ca", userID: "aJ48lW" },
  num: { shortURL: "i3BoGr", longURL: "https://www.google.ca", userID: "3" },
};


const userURLS = (id) => {
  const urls = [];
  for (var url in urlDatabase) {
    // console.log(urlDatabase[url].userID)
    if (urlDatabase[url].userID === id) {
      urls.push(urlDatabase[url])
    }
  }
  return urls
}



// app.get("/urls", (req, res) => {
//   const userId = req.session.user_id;
//   const currentUser = users[userId];
//   const urls = userURLS(userId)
//   let templateVars = {
//     urls: urls,
//     username: currentUser ? currentUser.email : null
//   }; //if no id then will return null
//   res.render("urls_index", templateVars);
// })






//   for (var url in urlObj) {
//     console.log(urlObj[url])
//     if (urlObj[url].userID === id) {
//       urls.push(urlObj[url]);
//     }
//     return urls;
//   }
// }

console.log(userURLS("aJ48lW"));

