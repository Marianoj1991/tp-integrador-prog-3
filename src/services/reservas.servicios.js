import { conexion } from "./dbConnection.db";

export default class ReservasServicios {
    
    crear = async(reservaId, servicios) => {

        try{
            await conexion.beginTransaction();

            for (const servicio of servicios){
                const sql = `INSERT INTO reservas_servicios (reservaId, servicio_id, importe) 
                    VALUES (?,?,?);`;
                conexion.execute(sql, [reservaId, servicio.servicio_id, servicio.importe ]);
            }

            await conexion.commit();

            return true;
        }catch(error){
            await conexion.rollback();
            console.log(`error ${error}`);
            return false;
        }
    }
}