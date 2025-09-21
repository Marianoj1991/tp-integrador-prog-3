import Usuarios from "../database/usuarios.db";
import UsuariosDTO from "../database/usuariosDTo";

export default class UsuariosServices {

    constructor() {
    this.usuarios = new Usuarios();
    }

    findAll = async (filter, limit, offset, order, asc) => {

    const sqlFilter = UsuariosDTO.toDBFields(filter);
    const sqlOrder = UsuariosDTO.getFieldName(order);

    const strAsc = (asc) ? "ASC " : "DESC ";
    const tableResults = await this.usuarios.findAll(sqlFilter, limit, offset, sqlOrder, strAsc);

    const dtoResults = tableResults.map(row => new UsuariosDTO(row["usuario_id"], row["nombre_usuario"], row["tipo_usuario"]));

    return dtoResults;
    }

    findById = async (id) => {
    const row = await this.usuarios.findById(id);
    return new UsuariosDTO(row["usuario_id"], row["nombre_usuario"], row["tipo_usuario"]);
    }

    create = async (usuario) => {
    const usuarioToInsert = {
        ...usuario,
        modificado: new Date().toISOString().replace('T', ' ').replace('Z', '')
    }
    return this.usuarios.create(usuarioToInsert);
    }

    update = async (usuarioId, usuario) => {
    const usuarioToUpdate = { 
        ...usuario,
    modificado: new Date().toISOString().replace('T', ' ').replace('Z', '')
    }
    return this.usuarios.update(usuarioId, usuarioToUpdate);
    }

    destroy = async (usuarioId) => {
    this.usuarios.destroy(usuarioId);
    }

};