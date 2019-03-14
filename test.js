const bcrypt = require('bcrypt');
const password = "dishwasher-funk"; // found in the req.params object
const hashedPassword = bcrypt.hashSync(password, 10);

console.log(hashedPassword)
