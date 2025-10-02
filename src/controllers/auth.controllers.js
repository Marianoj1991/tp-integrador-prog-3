import jwt from 'jsonwebtoken';
import passport from "passport";
process.loadEnvFile()


class AuthController {

    login = async (req, res) => {
        passport.authenticate('local', { session: false }, (err, user, info) => {
            if (err || !user) {
                return res.status(400).json({
                    message: info.message,
                    user
                });
            }

            req.login(user, { session: false }, (err) => {
                if (err) {
                    res.send(err);
                }
                
                const { contrasenia, ...restoUsuario } = user

                const token = jwt.sign(restoUsuario, process.env.JWT_SECRET, { expiresIn: '1h' });
                return res.json({ token });
            });
        })(req, res);
    };

}

export default AuthController;