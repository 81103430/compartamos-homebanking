const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const supabase = require('../supabase');

router.get('/perfil', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { data: perfil } = await supabase
      .from('perfiles')
      .select('*')
      .eq('id', decoded.id)
      .single();

    const { data: cuenta } = await supabase
      .from('cuentas')
      .select('*')
      .eq('usuario_id', decoded.id)
      .single();

    res.json({ perfil, cuenta });
  } catch (err) {
    res.status(401).json({ message: 'No autorizado' });
  }
});

module.exports = router;