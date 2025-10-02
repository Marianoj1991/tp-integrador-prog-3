import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import UsersServices from "../services/usuarios.services.js";
import bcryptjs from 'bcryptjs';

process.loadEnvFile()

const estrategia = new LocalStrategy({
    usernameField: 'nombreUsuario',
    passwordField: 'contrasenia'
},
    async (nombreUsuario, contrasenia, done) => {
        try {
            const service = new UsersServices();
            const user = await service.findByUserName(nombreUsuario);

            const esPassValido = await bcryptjs.compare(contrasenia, user.contrasenia)

            if (!user || !esPassValido) {
                return done(null, false, { message: 'Nombre de usuario y/o contraseña incorrectos.' });
            } else {
                return done(null, user, { message: 'Login correcto!' });
            }
        } catch (exc) {
            done(exc);
        }
    }
);

const validacion = new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
},
    async (jwtPayload, done) => {
        const service = new UsersServices();
        const user = await service.findById(jwtPayload.userId);
        if (user) {
            return done(null, user);
        } else {
            return done(null, false, { message: 'Token incorrecto.' });
        }
    }
);

export { estrategia, validacion };