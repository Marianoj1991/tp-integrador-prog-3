import express from 'express'
import cors from 'cors'
import helmet from 'helmet'

// CARGAMOS VARIABLES DE ENTORNO
process.loadEnvFile()

const app = express()
const port = process.env.PORT

// MIDDLEWARES
app.use(cors())
app.use(express.json({type: 'application/json'}))


// ROUTES

app.listen(port, () => console.log(`Server listening on port: ${port}. To close server press Ctrl + C`))

