import bcryptjs from 'bcryptjs'

export default async function hashPassword (pass) {
  // ENCRIPTACION DE CONTRASENIA
  const salt = await bcryptjs.genSalt(10)
  const hashedPassword = await bcryptjs.hash(pass, salt)
  return hashedPassword
}