import mysql from 'mysql2/promise'
process.loadEnvFile()

export default class DBConnection {
  static connection = null

  static async initConnection() {
    if (!DBConnection.connection) {
      DBConnection.connection = mysql.createPool({
        host: process.env.HOST,
        port: process.env.DB_PORT, // 🟢 Puerto agregado desde el .env
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
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
