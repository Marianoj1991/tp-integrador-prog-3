export default class UsuariosDTO {

    constructor(usuarioId, nombre, apellidoUsuario, tipoUsuario, modificado, activo ) {
        this.usuarioId = usuarioId;
        this.nombre = nombre;
        this.apellidoUsuario = apellidoUsuario;
            this.tipoUsuario = UsuariosDTO.getTipoUsuario(Number(tipoUsuario));
        this.modificado = modificado;
        this.activo = Number(activo) === 1 ? true : false;
    }

    static toDBFields (obj) {
        let resultado = [];
        const claves = Object.keys(obj);
        for (const k of claves) {
            const newObject = {}
            newObject[this.getFieldName(k)] = obj[k];
            resultado.push(newObject)
        }
        
        return resultado;
    };
    
    static getFieldName (atriObj) {
        const dbFields = {
            usuarioId: 'usuario_id',
            tipoUsuario: 'tipo_usuario',
            nombreUsuario: 'nombre_usuario'
        }

        return dbFields[atriObj] || atriObj
    };

    static getTipoUsuario (tipo) {
        const roles = {
            1: 'admin',
            2: 'empleado',
            3: 'usuario'
        }
        return roles[tipo] || new Error('Rol inexistente')
    }

}