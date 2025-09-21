export default class UsuariosDTO {

    constructor(usuarioId, nombreUsuario, tipoUsuario, ) {
        this.usuarioId = usuarioId;
        this.nombreUsuario = nombreUsuario;
        this.tipoUsuario = tipoUsuario;
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
            case "nombreUsuario":
                return "nombre_usuario";
            case "tipoUsuario":
                return "tipo_usuario";
        }
    };

}