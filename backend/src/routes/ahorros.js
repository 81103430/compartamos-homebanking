const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const supabase = require('../supabase');

router.get('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { data: cuenta, error: errorCuenta } = await supabase
      .from('cuentas')
      .select('*')
      .eq('usuario_id', decoded.id)
      .single();

    if (errorCuenta) {
      console.log('Error cuenta:', errorCuenta);
      return res.status(400).json({ message: 'Error al obtener cuenta' });
    }

    console.log('Cuenta encontrada:', cuenta);

    const { data: movimientos, error: errorMov } = await supabase
      .from('movimientos')
      .select('*')
      .eq('cuenta_id', cuenta.id)
      .order('fecha', { ascending: false });

    console.log('Movimientos:', movimientos);
    console.log('Error movimientos:', errorMov);

    res.json({ cuenta, movimientos: movimientos || [] });
  } catch (err) {
    console.error('Error general:', err);
    res.status(401).json({ message: 'No autorizado' });
  }
});

module.exports = router;