export default class SalonesDTO {
  constructor(salonId, direccion, titulo, capacidad, importe, activo, creado, modificado) {
    this.salonId = salonId
    this.direccion = direccion
    this.titulo = titulo
    this.importe = importe
    this.capacidad = capacidad
    this.activo = Number(activo) === 1 ? true : false
    this.creado = creado
    this.modificado = modificado
  }

  static toDBFields(obj) {
    let resultado = []
    const claves = Object.keys(obj)
    for (const k of claves) {
      const newObject = {}
      newObject[this.getFieldName(k)] = obj[k]
      resultado.push(newObject)
    }

    return resultado
  }

  static getFieldName(atriObj) {
    const dbFields = {
      salonId: 'salon_id',
    }

    return dbFields[atriObj] || atriObj
  }
}
