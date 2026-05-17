const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const supabase = require('../supabase');

router.get('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { data: creditos } = await supabase
      .from('creditos')
      .select('*')
      .eq('usuario_id', decoded.id)
      .order('fecha_solicitud', { ascending: false });

    res.json({ creditos: creditos || [] });
  } catch (err) {
    res.status(401).json({ message: 'No autorizado' });
  }
});

module.exports = router;