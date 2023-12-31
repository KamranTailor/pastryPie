const express = require("express");
const fs = require('fs');
const Datastore = require('nedb');
const router = express.Router();
const crypto = require('crypto');

const databaseLoginHistory = new Datastore("data/history/loginHistory.db");
databaseLoginHistory.loadDatabase();
const pageViews = new Datastore("data/history/pageViews.db");
pageViews.loadDatabase();

// Function to hash the password using SHA-256
function hashPassword(password) {
  const hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

router.post("/", async (request, response) => {
  try {
    // Read the userdata.json file
    const data = fs.readFileSync('data/userData.json', 'utf8');
    const userData = JSON.parse(data);

    // Find the user based on the provided userid
    const userIdToUpdate = request.body.userid;
    const userToUpdate = userData.find(user => user.userid === userIdToUpdate);

    if (request.body.admin == undefined) {
      if (userToUpdate) {
        // Update the user data with the provided values
        userToUpdate.fname = request.body.fname;
        userToUpdate.mname = request.body.mname;
        userToUpdate.lname = request.body.lname;
        userToUpdate.password = hashPassword(request.body.password); // Hash the password
        userToUpdate.dob = request.body.dob;

        // Save the updated data back to the file
        fs.writeFileSync('data/userdata.json', JSON.stringify(userData, null, 2), 'utf8');

        // Send a response indicating success
        response.json({ message: true });
      } else {
        response.json({ message: false, error: 'User not found with the provided userid.' });
      }
    } else if (request.body.admin == true) {
      if (userToUpdate) {
        // Update the user data with the provided values
        userToUpdate.fname = request.body.fname;
        userToUpdate.mname = request.body.mname;
        userToUpdate.lname = request.body.lname;
        userToUpdate.password = hashPassword(request.body.password); // Hash the password
        userToUpdate.username = request.body.username;
        userToUpdate.dob = request.body.dob;
        userToUpdate.userid = request.body.userid;
        userToUpdate.clinetApri = request.body.clinetApri;

        // Save the updated data back to the file
        fs.writeFileSync('data/userdata.json', JSON.stringify(userData, null, 2), 'utf8');

        // Send a response indicating success
        response.json({ message: true });
      } else {
        response.json({ message: false, error: 'User not found with the provided userid.' });
      }
    }
  } catch (error) {
    console.error(error);
    response.json({ message: false, error: 'An error occurred while updating the user data.' });
  }
});

module.exports = router;
