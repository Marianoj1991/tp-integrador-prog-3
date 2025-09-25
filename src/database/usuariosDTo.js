export default class UsuariosDTO {

    constructor(usuarioId, nombreUsuario, apellidoUsuario, tipoUsuario, modificado ) {
        this.usuarioId = usuarioId;
        this.nombreUsuario = nombreUsuario;
        this.apellidoUsuario = apellidoUsuario;
        this.tipoUsuario = tipoUsuario;
        this.modificado = modificado;
    }

    static toDBFields (obj) {
        let resultado = [];
        const claves = Object.keys(obj);
        for (const k of claves) {
            const newObjet = {}
            newObjet[getFieldName(k)] = obj[k];
            resultado.push(newObjet);
        }
    
        return resultado;
    };
    
    static getFieldName (atriObj) {
        switch (atriObj) {
            case "usuarioId":
                return "usuario_id";
            case "tipoUsuario":
                return "tipo_usuario";
        }
    };

}