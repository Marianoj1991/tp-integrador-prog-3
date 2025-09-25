import express from 'express'
import cors from 'cors'
import { router as usuarios } from './v1/rutas/usuarios.route.js';
import helmet from 'helmet'

// CARGAMOS VARIABLES DE ENTORNO
process.loadEnvFile()

const app = express()
const port = process.env.PORT

// MIDDLEWARES
app.use(cors())
app.use(express.json({type: 'application/json'}))


// ROUTES
app.use('/api', usuarios)
app.use('/api/v1', usuarios)

app.listen(port, () => console.log(`Server listening on port: ${port}. To close server press Ctrl + C`))

