import express from 'express'
import cors from 'cors'
import v1Router from './v1/rutas/usuarios.route.js';
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
app.use("/api/v1", v1AuthRouter);
app.use('/api/usuarios', v1Router)
app.use('/api/v1/usuarios', v1Router)

app.listen(port, () => console.log(`Server listening on port: ${port}. To close server press Ctrl + C`))

