const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/usuario', require('./routes/usuario'));
app.use('/api/ahorros', require('./routes/ahorros'));
app.use('/api/creditos', require('./routes/creditos'));
app.use('/api/transferencias', require('./routes/transferencias'));
app.use('/api/solicitudes', require('./routes/solicitudes'));

app.get('/', (req, res) => res.json({ mensaje: 'Backend Compartamos OK' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));