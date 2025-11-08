import path from 'path'
import express from 'express'
import cors from 'cors'
import passport from 'passport'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'

import RouterUsuariosV1 from './v1/rutas/usuarios.route.js'
import RouterServiciosV1 from './v1/rutas/servicios.route.js'
import RouterSalonesV1 from './v1/rutas/salones.route.js'
import RouterAuthV1 from './v1/rutas/auth.route.js'
import RouterShiftsV1 from './v1/rutas/turno.route.js'
import { estrategia, validacion } from './config/passport.js'
import { validarJWT } from './middlewares/auth/validarJWT.js'
import RouterReservasV1 from './v1/rutas/reservas.route.js'
import { fileURLToPath } from 'url'

process.loadEnvFile()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = process.env.PORT

app.use(cors())
app.use(express.json({ type: 'application/json' }))
passport.use(estrategia)
passport.use(validacion)
app.use(passport.initialize())

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Trabajo Integrador Prog III',
      version: '1.0.0',
      description: 'Documentación de la API con Swagger'
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Servidor local'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [path.join(__dirname, './v1/rutas/**/*.js')]
}

const swaggerDocs = swaggerJsdoc(swaggerOptions)

// ROUTES
app.use('/api/auth', RouterAuthV1)
app.use('/api/v1/auth', RouterAuthV1)
app.use('/api/usuarios', validarJWT, RouterUsuariosV1)
app.use('/api/v1/usuarios', validarJWT, RouterUsuariosV1)
app.use('/api/servicios', validarJWT, RouterServiciosV1)
app.use('/api/v1/servicios', validarJWT, RouterServiciosV1)
app.use('/api/salones', validarJWT, RouterSalonesV1)
app.use('/api/v1/salones', validarJWT, RouterSalonesV1)
app.use('/api/turnos', validarJWT, RouterShiftsV1)
app.use('/api/v1/turnos', validarJWT, RouterShiftsV1)
app.use('/api/reservas', validarJWT, RouterReservasV1)
app.use('/api/v1/reservas', validarJWT, RouterReservasV1)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.listen(port, () =>
  console.log(
    `Server listening on port: ${port}. To close server press Ctrl + C`
  )
)
