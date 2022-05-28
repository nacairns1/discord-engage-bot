const express = require('express');
const app = express();

const port = 5000;

const userRoutes = require('./routes/users-routes');
const guildRoutes = require('./routes/guild-routes');
const predictionRoutes = require('./routes/prediction-routes.js');

app.listen(port, ()=>{
    console.log(`api routes online on port ${port}`);
})


app.use(express.json())
// app.use('/users', userRoutes);
// app.use('/guilds', guildRoutes);
app.use('/predictions', predictionRoutes);

