import SalonesDB from '../database/salones.db.js'
import SalonesDTO from '../database/salonesDTO.js'

export default class SalonesServicios {
  constructor() {
    this.salones = new SalonesDB()
  }

  buscarTodos = async (filters, limit, offset, order, asc) => {
    let sqlFilter = null
    if (Object.keys(filters).length > 0) {
      sqlFilter = SalonesDTO.toDBFields(filters)
    }

    const sqlOrder = SalonesDTO.getFieldName(order)

    const strAsc = asc ? 'ASC ' : 'DESC '

    try {
      const salonesDbResultados = await this.salones.buscarTodos(
        sqlFilter,
        limit,
        offset,
        sqlOrder,
        strAsc
      )

      const dtoResultados = salonesDbResultados.map(
        (row) =>
          new SalonesDTO(
            row['salon_id'],
            row['direccion'],
            row['titulo'],
            row['capacidad'],
            row['importe'],
            row['activo'],
            row['creado'],
            row['modificado']
          )
      )

      return dtoResultados.length > 0 ? dtoResultados : []
    } catch (err) {
      throw err
    }
  }

  buscarPorId = async (id) => {
    try {
      const salon = await this.salones.buscarPorId(id)

      return salon ? new SalonesDTO(
        salon['salon_id'],
        salon['direccion'],
        salon['titulo'],
        salon['capacidad'],
        salon['importe'],
        salon['activo'],
        salon['creado'],
        salon['modificado']
      ) : null
    } catch (err) {
      throw err
    }
  }

  crear = async (salon) => {
    try {
      const existeSalon = await this.salones.buscarPorTitulo(salon.bTitulo)

      if (existeSalon) {
        console.error('[SERVICIOS][crear] Error:')
        throw new Error(`El salon ${bTitulo} ya existe`)
      }

      const result = await this.salones.crear(salon)

      return new SalonesDTO(
        result['salon_id'],
        result['direccion'],
        result['titulo'],
        result['capacidad'],
        result['importe'],
        result['activo'],
        result['creado'],
        result['modificado']
      )
    } catch (error) {
      throw error
    }
  }

  actualizar = async (salonId, datos) => {
    try {
      const existeSalon = await this.salones.buscarPorId(salonId)

      if (!existeSalon) {
        console.error('[Salones Servicios][actualizar] Error: No existe salón')
        throw new Error(`El salon no existe`)
      }

      const datosDB = SalonesDTO.toDBFields(datos).reduce((acc, act) => {
        return {
          ...acc,
          ...act
        }
      }, {})

      const result = await this.salones.actualizar(salonId, datosDB)
      return new SalonesDTO(
        result['salon_id'],
        result['direccion'],
        result['titulo'],
        result['capacidad'],
        result['importe'],
        result['activo'],
        result['creado'],
        result['modificado']
      )
    } catch (err) {
      console.error('[Salones Servicios][actualizar] Error: ', err)
      throw err
    }
  }

  eliminar = async (salonId) => {
    try {
      const existeSalon = await this.salones.buscarPorId(salonId)

      if (!existeSalon) {
        throw new Error(`El servicio no existe`)
      }
      this.salones.eliminar(salonId)
    } catch (err) {
      console.error(err.message)
      throw err
    }
  }
}
