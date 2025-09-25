import express from 'express'
import cors from 'cors'
import helmet from 'helmet'

import v1Router from './v1/rutas/usuarios.route.js'

// CARGAMOS VARIABLES DE ENTORNO
process.loadEnvFile()

const app = express()
const port = process.env.PORT

// MIDDLEWARES
app.use(cors())
app.use(express.json({type: 'application/json'}))


// ROUTES
app.use('/api/usuarios', v1Router)
app.use('/api/usuarios/v1', v1Router)

app.listen(port, () => console.log(`Server listening on port: ${port}. To close server press Ctrl + C`))

