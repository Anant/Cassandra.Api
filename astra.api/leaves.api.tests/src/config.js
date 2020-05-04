const { username, password, cluster, keyspace, table } = require('../../../astra.credentials/UserCred.json')

module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  ASTRA_CLUSTER: cluster,
  ASTRA_USERNAME: username,
  ASTRA_PASSWORD: password,
  ASTRA_KEYSPACE: keyspace,
  ASTRA_TABLE: table
};