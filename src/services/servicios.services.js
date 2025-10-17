import ServiciosDB from '../database/servicios.db.js'
import ServiciosDTO from '../database/serviciosDTO.js'

export default class Servicios {
  constructor() {
    this.servicios = new ServiciosDB()
  }

  buscarTodos = async (filters, limit, offset, order, asc) => {
    let sqlFilter = null
    if (Object.keys(filters).length > 0) {
      sqlFilter = ServiciosDTO.toDBFields(filters)
    }

    const sqlOrder = ServiciosDTO.getFieldName(order)

    const strAsc = asc ? 'ASC ' : 'DESC '

    try {
      const serviciosDbResultados = await this.servicios.buscarTodos(
        sqlFilter,
        limit,
        offset,
        sqlOrder,
        strAsc
      )

      const dtoResultados = serviciosDbResultados.map(
        (row) =>
          new ServiciosDTO(
            row['servicios_id'],
            row['descripcion'],
            row['importe'],
            row['modificado'],
            row['activo']
          )
      )

      return dtoResultados
    } catch (err) {
      throw err
    }
  }

  buscarPorId = async (id) => {
    try {
      const row = await this.servicios.buscarPorId(id)

      return new ServiciosDTO(
        row['servicios_id'],
        row['descripcion'],
        row['importe'],
        row['modificado'],
        row['activo']
      )
    } catch (err) {
      throw err
    }
  }

  crear = async (servicio) => {
    const { descripcion, importe, ...restoServicio } = servicio

    if (!descripcion || typeof descripcion !== 'string') {
      throw new Error('Descripción inválida')
    }

    if (!importe || typeof importe !== 'number') {
      throw new Error('Importe inválido')
    }

    try {
      const servicioToInsert = {
        ...restoServicio,
        modificado: new Date().toISOString().replace('T', ' ').replace('Z', '')
      }

      const existeServicio = await this.servicios.buscarPorDescripcion(
        servicio.descripcion
      )

      if (existeServicio) {
        console.error('[Servicios][crear] Error:')
        throw new Error(`El servicio ${servicio.descripcion} ya existe`)
      }

      const result = await this.servicios.crear(servicioToInsert)

      return new ServiciosDTO(
        result['servicios_id'],
        result['descripcion'],
        result['importe'],
        result['modificado'],
        result['activo']
      )
    } catch (error) {
      throw error
    }
  }

  actualizar = async (servicioId, datos) => {
    try {
      const existeServicio = await this.servicios.buscarPorId(servicioId)

      if (!existeServicio) {
        console.error('[Servicios][actualizar] Error:')
        throw new Error(`El servicio no existe`)
      }

      if (Number(existeServicio.activo) === 0) {
        throw new Error(`El servicio se encuentra inactivo`)
      }

      const datosNuevos = {
        ...datos,
        modificado: new Date().toISOString().replace('T', ' ').replace('Z', '')
      }

      const datosDB = ServiciosDTO.toDBFields(datosNuevos).reduce((acc, act) => {
        return {
          ...acc,
          ...act
        }
      }, {})

      return this.servicios.actualizar(servicioId, datosDB)
    } catch (err) {
      throw err
    }
  }

  eliminar = async (servicioId) => {
    try {
      const existeServicio = await this.servicios.buscarPorId(servicioId)

      if (!existeServicio) {
        throw new Error(`El servicio no existe`)
      }
      this.servicios.eliminar(servicioId)
    } catch (err) {
      console.error(err.message)
      throw err
    }
  }
}
