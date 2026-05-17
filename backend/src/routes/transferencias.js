const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const supabase = require('../supabase');

router.post('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { cuenta_destino, monto, descripcion } = req.body;

    if (!cuenta_destino || !monto || monto <= 0) {
      return res.status(400).json({ message: 'Datos inválidos' });
    }

    const { data: cuenta } = await supabase
      .from('cuentas')
      .select('*')
      .eq('usuario_id', decoded.id)
      .single();

    if (parseFloat(cuenta.saldo) < parseFloat(monto)) {
      return res.status(400).json({ message: 'Saldo insuficiente' });
    }

    await supabase
      .from('cuentas')
      .update({ saldo: parseFloat(cuenta.saldo) - parseFloat(monto) })
      .eq('id', cuenta.id);

    await supabase
      .from('transferencias')
      .insert({ cuenta_origen_id: cuenta.id, cuenta_destino, monto, descripcion });

    await supabase
      .from('movimientos')
      .insert({ cuenta_id: cuenta.id, tipo: 'retiro', monto, descripcion: `Transferencia a ${cuenta_destino}` });

    res.json({ message: 'Transferencia realizada exitosamente' });
  } catch (err) {
    res.status(401).json({ message: 'No autorizado' });
  }
});

router.get('/historial', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { data: cuenta } = await supabase
      .from('cuentas')
      .select('*')
      .eq('usuario_id', decoded.id)
      .single();

    const { data: transferencias } = await supabase
      .from('transferencias')
      .select('*')
      .eq('cuenta_origen_id', cuenta.id)
      .order('fecha', { ascending: false });

    res.json({ transferencias: transferencias || [] });
  } catch (err) {
    res.status(401).json({ message: 'No autorizado' });
  }
});

module.exports = router;