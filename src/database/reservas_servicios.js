import DBConnection from "./dbConnection.db.js";

export default class ReservasServicios {
    
    crear = async(reserva_id, servicios) => {

        try{
            await DBConnection.initConnection.beginTransaction();

            for (const servicio of servicios){
                const sql = `INSERT INTO reservas_servicios (reserva_id, servicio_id, importe) 
                    VALUES (?,?,?);`;
                DBConnection.initConnection.execute(sql, [reserva_id, servicio.servicio_id, servicio.importe ]);
            }

            await DBConnection.initConnection.commit();

            return true;
        }catch(error){
            await conexion.rollback();
            console.log(`error ${error}`);
            return false;
        }
    }
}