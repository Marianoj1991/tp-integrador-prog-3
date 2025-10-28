import express from 'express'
import cors from 'cors'
import passport from 'passport';
import RouterUsuariosV1 from './v1/rutas/usuarios.route.js';
import RouterServiciosV1 from './v1/rutas/servicios.route.js';
import RouterSalonesV1 from './v1/rutas/salones.route.js';
import RouterAuthV1 from './v1/rutas/auth.route.js';
import { estrategia, validacion } from './config/passport.js';

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
app.use("/api/auth", RouterAuthV1);
app.use("/api/v1/auth", RouterAuthV1);
app.use('/api/usuarios', RouterUsuariosV1)
app.use('/api/v1/usuarios', RouterUsuariosV1)
app.use('/api/servicios', RouterServiciosV1)
app.use('/api/v1/servicios', RouterServiciosV1)
app.use('/api/salones', RouterSalonesV1)
app.use('/api/v1/salones', RouterSalonesV1)
app.use('/api/protected', passport.authenticate('jwt', {session: false}), (req, res) => {
  res.json({message:'Authorized', user: req.user})
})

app.listen(port, () => console.log(`Server listening on port: ${port}. To close server press Ctrl + C`))

