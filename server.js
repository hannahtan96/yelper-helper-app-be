const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Router = require('./routes');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/yelper-helper', {
  useNewUrlParser: true
  // useFindAndModify: false,
  // useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function () {
  console.log('Connected successfully');
});

app.use(Router);

app.listen(3001, () => {
  console.log('Server is running at port 3001');
});

/*
app.use(express.json());
app.use(require('./routes/business'));
const dbo = require('./conn');

app.listen(port, () => {
  dbo.connectToServer(function(err) => {
    if (err) {
      console.log("there has been an error in port", err);
    }
  })
  console.log('server is running yay!')
})
*/
