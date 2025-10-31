import express from 'express'
import cors from 'cors'
import passport from 'passport';
import RouterUsuariosV1 from './v1/rutas/usuarios.route.js';
import RouterServiciosV1 from './v1/rutas/servicios.route.js';
import RouterSalonesV1 from './v1/rutas/salones.route.js';
import RouterAuthV1 from './v1/rutas/auth.route.js';
import { estrategia, validacion } from './config/passport.js';
import { validarJWT } from './middlewares/auth/validarJWT.js';

// CARGAMOS VARIABLES DE ENTORNO
process.loadEnvFile()

const app = express()
const port = process.env.PORT

// MIDDLEWARES
app.use(cors())
app.use(express.json({type: 'application/json'}))
passport.use(estrategia);
passport.use(validacion);
app.use(passport.initialize());

// ROUTES
app.use('/api/auth', RouterAuthV1)
app.use('/api/v1/auth', RouterAuthV1)
app.use('/api/usuarios', validarJWT, RouterUsuariosV1)
app.use('/api/v1/usuarios', validarJWT, RouterUsuariosV1)
app.use('/api/servicios', validarJWT, RouterServiciosV1)
app.use('/api/v1/servicios', validarJWT, RouterServiciosV1)
app.use('/api/salones', validarJWT, RouterSalonesV1)
app.use('/api/v1/salones', validarJWT, RouterSalonesV1)

app.listen(port, () => console.log(`Server listening on port: ${port}. To close server press Ctrl + C`))

