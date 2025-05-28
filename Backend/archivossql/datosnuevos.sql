-- PERFILES Y ROLES (solo estudiante y tutor)
INSERT INTO "Perfiles" (id_perfil, nombre) VALUES
(1, 'Estudiante'),
(2, 'Tutor');

INSERT INTO "Roles" (descripcion, funcion, id_perfil) VALUES
('Acceso a cursos', 'Accede a contenido del curso', 1),
('Gestionar sesiones', 'Puede ofrecer tutorías', 2);

-- USUARIOS: 5 estudiantes y 3 tutores
INSERT INTO "Usuarios" (id_usuario, nombre, correo_electronico, contrasena, telefono, id_perfil)
VALUES
(1, 'Laura Sánchez', 'laura@example.com', 'pass123', '1111111111', 1),
(2, 'Miguel Torres', 'miguel@example.com', 'pass123', '2222222222', 1),
(3, 'Elena Ramírez', 'elena@example.com', 'pass123', '3333333333', 1),
(4, 'Carlos Pérez', 'carlos@example.com', 'pass123', '4444444444', 1),
(5, 'Valeria Díaz', 'valeria@example.com', 'pass123', '5555555555', 1),
(6, 'Ana Tutor', 'ana.tutor@example.com', 'pass123', '6666666666', 2),
(7, 'Jorge Tutor', 'jorge.tutor@example.com', 'pass123', '7777777777', 2),
(8, 'Lucía Tutor', 'lucia.tutor@example.com', 'pass123', '8888888888', 2);

-- TUTORES INFO
INSERT INTO "TutoresInfo" (id, id_usuario, descripcion, tarifa_hora, experiencia, modalidad)
VALUES
(1, 6, 'Tutor de Matemáticas', 200.00, 4, 'virtual'),
(2, 7, 'Tutor de Física', 250.00, 6, 'presencial'),
(3, 8, 'Tutor de Programación', 300.00, 3, 'hibrido');

-- MATERIAS
INSERT INTO "Materias" (id_materia, nombre_materia) VALUES
(1, 'Matemáticas'),
(2, 'Física'),
(3, 'Programación'),
(4, 'Química');

-- TUTOR-MATERIA
INSERT INTO "TutorMateria" (id_tutor_materia, id_tutor, id_materia) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 3),
(4, 1, 4),
(5, 2, 1);

-- SESIONES entre estudiantes y tutores
INSERT INTO "Sesiones" (id_sesion, id_tutor, id_estudiante, id_materia, fecha_hora, duracion_min, estado)
VALUES
(1, 6, 1, 1, NOW() - INTERVAL '10 days', 60, 'completada'),
(2, 7, 2, 2, NOW() - INTERVAL '8 days', 90, 'completada'),
(3, 8, 3, 3, NOW() - INTERVAL '6 days', 45, 'completada'),
(4, 6, 4, 4, NOW() - INTERVAL '3 days', 60, 'cancelada'),
(5, 7, 5, 1, NOW() + INTERVAL '2 days', 60, 'pendiente'),
(6, 8, 1, 3, NOW() + INTERVAL '4 days', 75, 'pendiente');

-- PAGOS de sesiones completadas
INSERT INTO "Pagos" (id_pago, id_sesion, monto, metodo_pago, estado_pago)
VALUES
(1, 1, 200.00, 'transferencia', 'completado'),
(2, 2, 250.00, 'tarjeta', 'completado'),
(3, 3, 300.00, 'efectivo', 'completado');

-- CALIFICACIONES de sesiones completadas
INSERT INTO "Calificaciones" (id_calificacion, id_tutor, id_estudiante, id_sesion, calificacion, comentario)
VALUES
(1, 6, 1, 1, 5, 'Excelente tutor'),
(2, 7, 2, 2, 4, 'Muy claro en la explicación'),
(3, 8, 3, 3, 5, 'Muy buena clase');

-- BITÁCORA de eventos
INSERT INTO "Bitacora" (id, id_usuario, tipo_evento, descripcion, ip_origen)
VALUES
(1, 1, 'inicio_sesion', 'El usuario inició sesión', '192.168.1.1'),
(2, 2, 'registro', 'El usuario se registró en el sistema', '192.168.1.2'),
(3, 6, 'inicio_sesion', 'El tutor inició sesión', '192.168.1.3');

-- NOTIFICACIONES para usuarios
INSERT INTO "Notificaciones" (id_notificacion, id_usuario, tipo_notificacion, mensaje)
VALUES
(1, 1, 'recordatorio', 'Tienes una sesión próxima en dos días'),
(2, 2, 'alerta', 'Tu sesión fue cancelada'),
(3, 6, 'mensaje', 'Un estudiante te calificó');
