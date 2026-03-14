const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config({ path: './Backend/.env' });

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        const users = await User.find({});
        console.log("Users in database:");
        users.forEach(user => {
            console.log(`- Email: ${user.email}, isVerified: ${user.isVerified}`);
        });
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
