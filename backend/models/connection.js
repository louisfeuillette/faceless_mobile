// mongodb+srv://facelessadmin:fl32kju122D@cluster0.7hc88.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

var mongoose = require('mongoose');

var user = 'facelessadmin';
var password = 'fl32kju122D';
var dbname = 'Faceless';
var clusterName = 'cluster0.7hc88.mongodb.net';

var options = {
  connectTimeoutMS: 5000,
  useNewUrlParser: true,
  useUnifiedTopology: true 
 };

const URI_BDD = `mongodb+srv://${user}:${password}@${clusterName}/${dbname}?retryWrites=true&w=majority`

mongoose.connect(URI_BDD,
  options,
  function (err) {
    if (err) {
      console.log(`error, failed to connect to the database because --> ${err}`);
    } else {
      console.info('*** Database Faceless connection : Success ***');
    }
  }
);

module.exports = mongoose
