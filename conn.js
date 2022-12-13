const { MongoClient } = require('mongodb');
const Db = 'mongodb://localhost:27017/';
const client = new MongoClient(Db, { useNewUrlParser: true });

let _db;

module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      if (db) {
        _db = db.db('helper-yelper');
        console.log('successfully connected to mongodb');
      }
      return callback(err);
    });
  },
  getDb: function () {
    return _db;
  }
};

// let http = require('http');
// let MongoClient = require('mongodb').MongoClient;

/*
MongoClient.connect(
  'mongodb://localhost:27017/',
  { useNewUrlParser: true },
  function (err, db) {
    if (err) throw err;
    let dbo = db.db('yelper-helper');
    let query = { business_id: 'Pns2l4eNsfO8kk83dixA6A' };

    dbo
      .collection('businesses')
      .find(query)
      .toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
      });
  }
);
*/
