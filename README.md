# 🎓 Trabajo Final Integrador — Programación III (UNER)

Este repositorio contiene el desarrollo completo del Trabajo Final Integrador correspondiente a la asignatura **Programación III** de la **Tecnicatura Universitaria en Desarrollo Web** (Facultad de Ciencias de la Administración — UNER), cursado durante el segundo cuatrimestre de 2025.

## 🧠 Objetivos del proyecto

- Aplicar los conocimientos adquiridos durante la cursada mediante el desarrollo de una **API REST** funcional.
- Implementar autenticación, autorización y validación de datos.
- Diseñar y gestionar entidades relacionadas con la **gestión de reservas de salones de cumpleaños**.
- Documentar el API utilizando Swagger.

## 🏗️ Tecnologías utilizadas

- **Node.js** + **Express.js**
- **MySQL** como sistema de persistencia
- **JWT** para autenticación
- **express-validator** para validaciones
- **Swagger** para documentación del API
- **Postman/Bruno** para pruebas de endpoints

## 🔐 Roles y funcionalidades

### Cliente
- Iniciar sesión
- Crear y listar reservas
- Consultar salones, servicios y turnos
- Recibir notificaciones automáticas

### Empleado
- Iniciar sesión
- Consultar reservas y clientes
- BREAD completo de salones, servicios y turnos

### Administrador
- Iniciar sesión
- BREAD completo de todas las entidades
- Generar informes estadísticos (PDF, CSV)
- Recibir notificaciones automáticas

## 🗃️ Modelo de datos

El sistema gestiona las siguientes entidades:

- `salones`
- `servicios`
- `turnos`
- `reservas`
- `reservas_servicios`
- `usuarios`

Incluye reglas de negocio como **soft delete**, generación de estadísticas mediante **stored procedures**, y restricciones de edición según rol.

## 👥 Grupo de trabajo

- Grupo: K
- Integrantes:
  - Sofia Guardia
  - Mariano Jimenez
  - Macarena Schefer
  - Luciano Cirvini
