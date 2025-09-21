import mysql from 'mysql2/promise'
process.loadEnvFile()

export default class DBConnection {
  static connection = null

  static async initConnection() {
    if (!DBConnection.connection) {
      DBConnection.connection = mysql.createPool({
        host: 'localhost',
        user: 'root',
        database: 'reservas',
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
