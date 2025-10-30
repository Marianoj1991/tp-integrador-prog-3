export default class ShiftsDTO {
    
    constructor(
        turnoId, 
        servicioId, 
        clienteId, 
        horaInicio, 
        duracionMinutos, 
        estado, 
        notas, 
        creado, 
        modificado
    ) {
        this.turnoId = turnoId;
        this.servicioId = servicioId;
        this.clienteId = clienteId;
        this.horaInicio = horaInicio;
        this.duracionMinutos = duracionMinutos;
        this.estado = estado;
        this.notas = notas;
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
    };
    
    static getFieldName (atriObj) {
        const dbFields = {
            turnoId: 'turno_id',
            servicioId: 'servicio_id',
            clienteId: 'cliente_id',
            horaInicio: 'hora_inicio',
            duracionMinutos: 'duracion_minutos'
        }

        return dbFields[atriObj] || atriObj;
    };

}