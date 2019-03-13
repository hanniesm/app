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

//function creates a random number for the addUserID
const randomID = () => {
  return "user" + Math.floor((Math.random() * 100) + 1) + "RandomIDObject.values(";
}

const addUser = (email, password) => {
  const id = randomID();

  const newUser = {
    id: id,
    email: email,
    password: password
  }

  users[id] = newUser;
}

const emailLookup = (email) => {
  for (var user in users) {
    if (user.email === email) {
      return true
    }
  }
}

const emailIDLookup = (email) => {
  const usersArray = Object.values(users)
  for (var user in usersArray) {
    if (usersArray[user].email === email) {
      console.log(usersArray[user].id)
      return usersArray[user].id
    }
  }
}

emailIDLookup("user@example.com");