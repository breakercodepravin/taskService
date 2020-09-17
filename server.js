const express = require('express');
const connectDB = require('./config/db');
const app = express()

//connect DB
connectDB();

// Body parser middleware
app.use(express.json({ extended: false }));

const userRouter = require('./routes/user');
const contactRouter = require('./routes/contact')

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-auth-token');
  next();
});

app.use('/api/users', userRouter)
app.use('/api/contacts', contactRouter)

app.get('/', (req, res) => {
  res.send('Hello World!')
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(` app listening on port 5000!`))