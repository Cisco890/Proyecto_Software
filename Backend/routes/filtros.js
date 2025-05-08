const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

//Metodo Get de los nombres de los tutores
router.get('/nombre',async (req,res)=>{
    const nombre = await prisma.perfiles;
    const id_perfil = await prisma.perfiles; 

    try{
        const nombres = await prisma.usuarios.findMany({
            
        })        


    }catch (err){
        console.error(err.message);
        res.status(500).send('Error del servidor')
    }
})



// Filtro de horarios (vespertino, matutino, nocturno)
router.get('/horarios/:horario', async (req, res) => {
  const { horario } = req.params;

  try {
    const tutores = await prisma.tutorMateria.findMany({
      where: {
        horario: horario
      },
      include: {
        tutor: {
          include: {
            usuario: true
          }
        },
        materia: true
      }
    });

    res.json(tutores.map(tm => ({
      ...tm.tutor,
      usuario: tm.tutor.usuario,
      })));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});