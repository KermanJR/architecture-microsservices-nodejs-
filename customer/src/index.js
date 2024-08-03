const express = require('express');
const { PORT } = require('./config');
const { connectDB, sequelize } = require('./database/connection');
const expressApp = require('./express-app');
require('dotenv').config();



const StartServer = async () => {
  
    const app = express();
    await connectDB();
    await expressApp(app);
    await sequelize.sync();
    console.log('Database synchronized')

    app.listen(PORT, () => {
        console.log(`listening to port ${PORT}`);
    }).on('error', (err) => {
        console.log(err);
        process.exit();
    });
}

StartServer();
