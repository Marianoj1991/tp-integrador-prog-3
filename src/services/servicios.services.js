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
            row['servicio_id'],
            row['descripcion'],
            row['importe'],
            row['activo'],
            row['creado'],
            row['modificado'],
          )
      )

      return dtoResultados
    } catch (err) {
      throw err
    }
  }

  buscarPorId = async (id) => {
    try {
      const servicio = await this.servicios.buscarPorId(id)

      return new ServiciosDTO(
        servicio['servicio_id'],
        servicio['descripcion'],
        servicio['importe'],
        servicio['activo'],
        servicio['creado'],
        servicio['modificado']
      )
    } catch (err) {
      throw err
    }
  }

  crear = async (servicio) => {
    const { bDescripcion, bImporte, ...restoServicio } = servicio
    if (!bDescripcion|| typeof bDescripcion !== 'string') {
      throw new Error('Descripción inválida')
    }

    if (!bImporte || typeof bImporte !== 'number') {
      throw new Error('Importe inválido')
    }

    try {
      const servicioToInsert = {
        bDescripcion,
        bImporte,
        ...restoServicio,
      }

      const existeServicio = await this.servicios.buscarPorDescripcion(
        bDescripcion
      )

      if (existeServicio) {
        console.error('[Servicios][crear] Error:')
        throw new Error(`El servicio ${bDescripcion} ya existe`)
      }

      const servicio = await this.servicios.crear(servicioToInsert)


      return new ServiciosDTO(
        servicio['servicio_id'],
        servicio['descripcion'],
        servicio['importe'],
        servicio['activo'],
        servicio['creado'],
        servicio['modificado']
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

      const datosNuevos = {
        ...datos
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
