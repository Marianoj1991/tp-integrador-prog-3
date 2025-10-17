export default class ServiciosDTO {

    constructor(servicioId, descripcion, importe, activo, creado, modificado ) {
        this.servicioId = servicioId;
        this.descripcion = descripcion;
        this.importe = importe;
        this.activo = Number(activo) === 1 ? true : false;
        this.creado = creado;
        this.modificado = modificado;
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
            servicioId: 'servicio_id'        
        }

        return dbFields[atriObj] || atriObj
    };

}