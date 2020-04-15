const cassandra = require('cassandra-driver');

module.exports = new cassandra.Client({
  cloud: { secureConnectBundle: 'path/to/secure-connect-database_name.zip' },
  credentials: { username: 'username', password: 'password' }
});
