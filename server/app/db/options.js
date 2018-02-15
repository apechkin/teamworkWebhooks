module.exports = {
  user : process.env.NODE_ORACLEDB_USER || "username",
  password : process.env.NODE_ORACLEDB_PASSWORD || "password",
  host: process.env.NODE_ORACLEDB_HOST || 'host',
  port: process.env.NODE_ORACLEDB_PORT || 1521,
  service: process.env.NODE_ORACLEDB_SERVICE || 'service'
};
