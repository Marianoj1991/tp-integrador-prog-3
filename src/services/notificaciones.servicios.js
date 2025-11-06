import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import handlebars from 'handlebars'

process.loadEnvFile()

export default class NotificacionesServicio {
  enviarCorreo = async (datosCorreo, adminMails) => {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const plantillaPath = path.join(
      __dirname,
      '../plantillas/handlebars/plantillaNotificacion.hbs'
    )
    const plantilla = fs.readFileSync(plantillaPath, 'utf-8')

    try {
      const plantillaHandlebars = handlebars.compile(plantilla)


      const datos = {
        fecha: datosCorreo.fecha_reserva,
        salon: datosCorreo.nombre_salon,
        turno: datosCorreo.turno,
        hasta: datosCorreo.turno_hasta
      }

      const correoHtml = plantillaHandlebars(datos)

      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.CORREO,
          pass: process.env.CLAVE
        }
      })

      const correosAdmin = adminMails.map((a) => a.nombre_usuario)

      const destinatarios = correosAdmin.join(', ')

      const mailOptions = {
        from: process.env.CORREO,
        to: destinatarios,
        cc: datosCorreo.nombre_usuario,
        subject: 'Nueva Reserva',
        html: correoHtml
      }

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(`Error enviado el correo`, error)
          return false
        }
        return true
      })
    } catch (error) {
      throw error
    }
  }

  // OTROS TIPOS DE NOTIFICACION
  enviarMensaje = async (datos) => {}

  enviarWhatsapp = async (datos) => {}

  enviarNotificacionPush = async (datos) => {}
}
