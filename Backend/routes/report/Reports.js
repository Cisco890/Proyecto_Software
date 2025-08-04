const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


// Consulta general
router.get('/general', async (req, res) => {
  try {
    
    const [
      totalUsuarios,
      totalTutores,
      totalEstudiantes,
      totalSesiones,
      sesionesCompletadas,
      ingresosTotales,
      materiasPopulares,
      calificacionPromedio
    ] = await Promise.all([
      // Usuarios
      prisma.usuarios.count(),
      
      // Tutores
      prisma.usuarios.count({
        where: { id_perfil: 2 }
      }),
      
      // estudiantes
      prisma.usuarios.count({
        where: { id_perfil: 1 }
      }),
      
      // sesiones
      prisma.sesiones.count(),
      
      // completas
      prisma.sesiones.count({
        where: { estado: 'completada' }
      }),
      
      // Ingresos
      prisma.pagos.aggregate({
        _sum: { monto: true },
        where: { estado_pago: 'completado' }
      }),
      
      // Materias más populares
      prisma.materias.findMany({
        take: 5,
        orderBy: {
          sesiones: {
            _count: 'desc'
          }
        },
        include: {
          _count: {
            select: { sesiones: true }
          }
        }
      }),
      
      // Calificación promedio de los tutores
      prisma.calificaciones.aggregate({
        _avg: { calificacion: true }
      })
    ]);


    //Datps enviados a un json.
    res.json({
      totalUsuarios,
      totalTutores,
      totalEstudiantes,
      totalSesiones,
      sesionesCompletadas,
      porcentajeCompletadas: totalSesiones > 0 
        ? (sesionesCompletadas / totalSesiones * 100).toFixed(2) 
        : 0,
      ingresosTotales: ingresosTotales._sum.monto || 0,
      materiasPopulares: materiasPopulares.map(m => ({
        id: m.id_materia,
        nombre: m.nombre_materia,
        totalSesiones: m._count.sesiones
      })),
      calificacionPromedio: calificacionPromedio._avg.calificacion ?
        parseFloat(calificacionPromedio._avg.calificacion.toFixed(2)) : 0,
      ultimaActualizacion: new Date()
    });
  } catch (err) {
    console.error('Error al obtener estadísticas generales:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = router;