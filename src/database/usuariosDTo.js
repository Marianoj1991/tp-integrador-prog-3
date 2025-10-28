

export default class UsuariosDTO {
  constructor(
    usuarioId,
    nombre,
    apellido,
    nombreUsuario,
    tipoUsuario,
    modificado,
    activo,
    celular = '',
    foto = ''
  ) {
    this.usuarioId = usuarioId
    this.nombre = nombre
    this.apellido = apellido
    this.nombreUsuario = nombreUsuario
    this.tipoUsuario = UsuariosDTO.getTipoUsuario(Number(tipoUsuario))
    this.celular = celular ? celular : '',
    this.foto = foto ? foto : '',
    this.modificado = modificado
    this.activo = Number(activo) === 1 ? true : false
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
      usuarioId: 'usuario_id',
      tipoUsuario: 'tipo_usuario',
      nombreUsuario: 'nombre_usuario'
    }

    return dbFields[atriObj] || atriObj
  }

  static getTipoUsuario(tipo) {
    const roles = {
      1: 'admin',
      2: 'empleado',
      3: 'cliente'
    }
    return roles[tipo] || new Error('Rol inexistente')
  }
}
