import { createObjectCsvWriter } from 'csv-writer'
import puppeteer from 'puppeteer'
import handlebars from 'handlebars'

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default class InformeServicio {
  informeReservasCsv = async ({
    datosInforme
  }) => {
    try {
      let ruta = path.resolve(__dirname, '../plantillas')
      ruta = path.join(ruta, 'reservas.csv')

      const csvWriter = createObjectCsvWriter({
        path: ruta,
        header: [
          { id: 'fecha_reserva', title: 'Fecha reserva' },
          { id: 'titulo', title: 'Título' },
          { id: 'orden', title: 'Orden' }
        ]
      })

      await csvWriter.writeRecords(datosInforme)
      return ruta
    } catch (error) {
      console.log(`Error generando csv ${error}`)
    }
  }

  informeReservasPdf = async ({
    fechaGeneracion,
    datosInforme,
    totalPorSalon,
    ingresosPorMes
  }) => {
    try {
      const plantillaPath = path.join(
        __dirname,
        '../plantillas/handlebars/informe.hbs'
      )
      const plantillaHtml = fs.readFileSync(plantillaPath, 'utf8')

      const plantillaCompilada = handlebars.compile(plantillaHtml)

      const htmlFinal = plantillaCompilada({
        fechaGeneracion,
        reservas: datosInforme,
        mes: ingresosPorMes,
        total: totalPorSalon
      })

      let browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      })

      let page = await browser.newPage()
      await page.setContent(htmlFinal)

      const buffer = await page.pdf({
        path: 'reservas.pdf',
        format: 'A4',
        printBackground: true
      })

      await browser.close()

      return buffer
    } catch (error) {
      console.error('Error generando el PDF:', error)
      throw error
    }
  }
}
