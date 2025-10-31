import mysql from 'mysql2/promise'
process.loadEnvFile()

export default class DBConnection {
  static connection = null
  static async initConnection() {
    if (!DBConnection.connection) {
      DBConnection.connection = mysql.createPool({
        host: process.env.HOST,
        user: process.env.DB_USER,
        password: process.env.DB_USER_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        maxIdle: 10,
        idleTimeout: 60000,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0
      })
    }

    return DBConnection.connection
  }
}
