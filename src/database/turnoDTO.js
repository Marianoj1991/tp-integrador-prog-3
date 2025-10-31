export default class ShiftsDTO {
  constructor(
    turnoId,
    orden,
    horaDesde,
    horaHasta,
    activo,
    creado,
    modificado
  ) {
    this.turnoId = turnoId;
    this.orden = orden;
    this.horaDesde = horaDesde;
    this.horaHasta = horaHasta;
    this.activo = activo;
    this.creado = creado;
    this.modificado = modificado;
  }

  static toDBFilters(filters) {
    if (!filters || Object.keys(filters).length === 0) {
      return [];
    }

    const resultado = [];
    const claves = Object.keys(filters);

    for (const k of claves) {
      const newObject = {};
      newObject[this.getFieldName(k)] = filters[k];
      resultado.push(newObject);
    }

    return resultado;
  }

  static getFieldName(atriObj) {
    const dbFields = {
      turnoId: "turno_id",

      horaInicio: "hora_inicio",
      horaDesde: "hora_desde",
      horaHasta: "hora_hasta",
    };

    return dbFields[atriObj] || atriObj;
  }
}
