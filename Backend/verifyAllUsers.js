const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config({ path: './Backend/.env' });

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        const result = await User.updateMany({}, { isVerified: true });
        console.log(`✅ Updated ${result.modifiedCount} users to isVerified: true`);
        process.exit(0);
    })
    .catch(err => {
        console.error("❌ Error updating users:", err);
        process.exit(1);
    });
