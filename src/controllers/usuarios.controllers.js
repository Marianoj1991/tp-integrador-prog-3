import UsuariosServices from "../services/usuarios.services";

export default class UsuariosControllers {

    constructor() {
        this.usuarios = new UsuariosServices();
    }

    findAll = async (req, res) => {

        const nombre = req.query.nombre;
        const apellido = req.query.apellido;

        const limit = req.query.limit;
        const offset = req.query.offset;
        const order = req.query.order;
        const asc = req.query.asc;

        try {

            const pLimit = limit ? Number(limit) : 0;
            const pOffset = offset ? Number(offset) : 0;
            const pOrder = order || "usuarioId";
            const pAsc = asc === "false" ? false : true;

            const filter = {};

            if (nombre) filter.nombre = nombre;
            if (apellido) filter.apellido = apellido;

            const dataUsuarios = await this.usuarios.findAll(filter, pLimit, pOffset, pOrder, pAsc);

            res.json({ status: "OK", data: dataUsuarios});

        } catch (error) {
                res
                .status(error?.status || 500)
                .json({ status: "FAILD", data: { error: error?.message || error } });
            }
};


    findById = async (req, res) => {
        const usuarioId = Number(req.params.usuarioId);

        if (!Number.isInteger(usuarioId)) {
            return res.status(400).json({ error: 'El parámetro debe ser un número entero' });
        }

        try{
            const usuario = await this.usuarios.findById(usuarioId);

            if (!usuario) {
                res.json({ status: "OK", data: usuario});
            }
        }catch (error) {
            res
            .status(error?.status || 500)
            .json({ status: "FAILED", data: { error: error?.message || error } });
        }
    };

    create = async (req, res) => {
        const { body } = req;

        if (!body.nombre || !body.apellido || !body.nombreUsuario || !body.contrasenia) {
            res
                .status(400)
                .json({
                    status: "FAILED",
                    data: {
                        error: "Uno de los siguientes datos falta o es vacío: 'nombre', 'apellido' 'nombre de usuario', 'contrasenia'."
                    }
                });
        }

        const usuario = {
            nombre: body.nombre,
            apellido: body.apellido
        };

        try {
            const usuarioCreado = await this.usuarios.create(usuario);
            res.status(201).json({ status: "OK", data: usuarioCreado });
        } catch (error) {
            res
            .status(error?.status || 500)
            .json({ status: "FAILED", data: { error: error?.message || error } });
        }
    }

    update = async (req, res) => {
        const body = req.body;
        const usuarioId = req.params.usuarioId

        if (!usuarioId) {
            res
                .status(404)
                .json({
                    status: "FAILED",
                    data: {
                        error: "El parámetro usuarioId no puede ser vacío."
                    }
                });
        }

        try {
            const usuarioActualizado = await this.usuarios.update(usuarioId, body);
            res.status(200).json(usuarioActualizado);
        } catch (error) {
            res.status(error?.status || 500).json({ status: "FAILED", data: { error: error?.message || error } });
        }
    }

    destroy = async (req, res) => {

        const usuarioId = req.params.usuarioId;

        if (!usuarioId) {
            res.status(404).json({ status: "FAILED", data: { error: "El parámetro usuarioId no puede ser vacío." } })
        }

        try {
            await this.usuarios.destroy(usuarioId);
            res.status(204).json();
        } catch (error) {
            res.status(error?.status || 500).send({ status: "FAILED", data: { error: error?.message || error } });
        }
    }
};