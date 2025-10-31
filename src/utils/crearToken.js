import jwt from 'jsonwebtoken'

export function crearToken(usuario) {
  
  const { usuarioId, nombreUsuario, tipoUsuario } = usuario

  const token = jwt.sign(
    {
      usuarioId,
      nombreUsuario,
      tipoUsuario
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  )

  return token
}
