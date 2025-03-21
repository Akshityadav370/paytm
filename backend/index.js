const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const { connectToMongoDB } = require('./db');
const rootRouter = require('./routes/index');
const cors = require('cors');

const app = express();
app.use(cors);

app.use(express.json());
app.use('/api/v1', rootRouter);

app.listen(process.env.PORT || 3000, async () => {
  try {
    connectToMongoDB();
    console.log('listening on PORT ' + process.env.PORT);
  } catch (error) {
    console.error('Error connecting to DB!', error);
  }
});
