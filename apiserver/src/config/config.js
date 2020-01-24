const path = require('path')

module.exports = {
  httpPort: process.env.PORT || 8081,
  db: {
    database: process.env.DB_NAME || 'midigig',
    user: process.env.DB_USER || 'midigig',
    password: process.env.DB_PASS || 'midigig',
    options: {
      dialect: process.env.DIALECT || 'sqlite',
      host: process.env.HOST || '127.0.0.1',
      storage: path.resolve(__dirname, '../../../Database/midigig.db'),
    }
  },
  messagePort: 8088
}
