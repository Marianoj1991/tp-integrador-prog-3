-- Procedimientos

DROP PROCEDURE IF EXISTS ingresosPorMes;
DELIMITER ;;
CREATE PROCEDURE ingresosPorMes()
BEGIN
	SELECT DATE_FORMAT(fecha_reserva, '%Y-%m') AS mes, SUM(importe_total) AS ingresos
	FROM reservas
	GROUP BY mes
	ORDER BY mes;
END ;;
DELIMITER ;

DROP PROCEDURE IF EXISTS obtenerDatosInforme;
DELIMITER ;;
CREATE PROCEDURE obtenerDatosInforme()
BEGIN
	SELECT DATE_FORMAT(r.fecha_reserva, '%Y-%m-%d') AS fecha_reserva, s.titulo, t.hora_desde
	FROM reservas AS r
	INNER JOIN salones AS s ON s.salon_id = r.salon_id
	INNER JOIN turnos AS t ON t.turno_id = r.turno_id;
END ;;
DELIMITER ;

DROP PROCEDURE IF EXISTS obtenerDatosNotificacion;
DELIMITER ;;
CREATE PROCEDURE obtenerDatosNotificacion(
	IN pid_reserva INT,
	IN pid_usuario INT
)
BEGIN
	SELECT 
		DATE_FORMAT(r.fecha_reserva, '%d/%m/%Y') AS fecha_reserva,
		s.titulo AS nombre_salon,
		t.hora_desde AS turno,
		t.hora_hasta AS turno_hasta,
		u.nombre_usuario
	FROM reservas AS r
	INNER JOIN usuarios AS u ON u.usuario_id = pid_usuario
	INNER JOIN salones AS s ON s.salon_id = r.salon_id
	INNER JOIN turnos AS t ON t.turno_id = r.turno_id
	WHERE r.reserva_id = pid_reserva;
END ;;
DELIMITER ;

DROP PROCEDURE IF EXISTS obtenerMailAdmins;
DELIMITER ;;
CREATE PROCEDURE obtenerMailAdmins()
BEGIN
	SELECT nombre_usuario FROM usuarios WHERE tipo_usuario = 1;
END ;;
DELIMITER ;

DROP PROCEDURE IF EXISTS totalReservasPorSalon;
DELIMITER ;;
CREATE PROCEDURE totalReservasPorSalon()
BEGIN
	SELECT s.titulo, COUNT(*) AS cantidad_reservas, SUM(r.importe_total) AS total_ingresos
	FROM reservas r
	INNER JOIN salones s ON s.salon_id = r.salon_id
	GROUP BY s.titulo;
END ;;
DELIMITER ;

ALTER TABLE reservas
ADD COLUMN comentario TEXT NULL AFTER importe_total;

