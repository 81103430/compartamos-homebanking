const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const supabase = require('../supabase');

// Crear solicitud
router.post('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { monto, cuotas, motivo } = req.body;

    if (!monto || !cuotas || !motivo) {
      return res.status(400).json({ message: 'Completa todos los campos' });
    }

    await supabase.from('solicitudes_credito').insert({
      usuario_id: decoded.id, monto, cuotas, motivo, estado: 'enviado'
    });

    res.json({ message: 'Solicitud enviada correctamente' });
  } catch (err) {
    res.status(401).json({ message: 'No autorizado' });
  }
});

// Ver mis solicitudes
router.get('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { data: solicitudes } = await supabase
      .from('solicitudes_credito')
      .select('*')
      .eq('usuario_id', decoded.id)
      .order('fecha_solicitud', { ascending: false });

    res.json({ solicitudes: solicitudes || [] });
  } catch (err) {
    res.status(401).json({ message: 'No autorizado' });
  }
});

// Ver todas (admin/comité)
router.get('/bandeja', async (req, res) => {
  try {
    const { data: solicitudes } = await supabase
      .from('solicitudes_credito')
      .select('*, perfiles(nombre, dni)')
      .order('fecha_solicitud', { ascending: false });

    res.json({ solicitudes: solicitudes || [] });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener bandeja' });
  }
});

// Evaluar solicitud
router.patch('/:id/evaluar', async (req, res) => {
  try {
    await supabase.from('solicitudes_credito')
      .update({ estado: 'en evaluacion', fecha_evaluacion: new Date() })
      .eq('id', req.params.id);
    res.json({ message: 'Solicitud en evaluación' });
  } catch (err) {
    res.status(500).json({ message: 'Error' });
  }
});

// Aprobar o rechazar
router.patch('/:id/decision', async (req, res) => {
  try {
    const { decision, comentario } = req.body;
    await supabase.from('solicitudes_credito')
      .update({ estado: decision, fecha_decision: new Date(), comentario })
      .eq('id', req.params.id);
    res.json({ message: `Solicitud ${decision}` });
  } catch (err) {
    res.status(500).json({ message: 'Error' });
  }
});

module.exports = router;