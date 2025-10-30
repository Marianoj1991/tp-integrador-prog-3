import express from 'express'
import cors from 'cors'
import usuariosV1Router from './v1/rutas/usuarios.route.js';
import serviciosRouter from './v1/rutas/servicios.route.js';
import turnosRouter from './v1/rutas/shifts.route.js';
import passport from 'passport';
import v1AuthRouter from './v1/rutas/auth.route.js';
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
app.use("/api/v1/auth", v1AuthRouter);
app.use('/api/usuarios', usuariosV1Router)
app.use('/api/v1/usuarios', usuariosV1Router)
app.use('/api/v1/protected', passport.authenticate('jwt', {session: false}), (req, res) => {
  res.json({message:'Authorized', user: req.user})
})
app.use('/api/servicios', serviciosRouter)
app.use('/api/v1/servicios', serviciosRouter)
app.use('/api/v1/shifts', turnosRouter)
app.use('/api/turnos', turnosRouter)
app.listen(port, () => console.log(`Server listening on port: ${port}. To close server press Ctrl + C`))

