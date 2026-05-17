const supabase = require('../supabase');
const jwt = require('jsonwebtoken');

async function login(req, res) {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) return res.status(401).json({ message: 'Credenciales incorrectas' });

  const token = jwt.sign(
    { id: data.user.id, email: data.user.email },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.json({ token, user: { id: data.user.id, email: data.user.email } });
}

async function register(req, res) {
  const { email, password, nombre, dni, telefono } = req.body;

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return res.status(400).json({ message: error.message });

  await supabase.from('perfiles').insert({
    id: data.user.id,
    nombre,
    dni,
    telefono
  });

  res.json({ message: 'Usuario registrado correctamente' });
}

module.exports = { login, register };