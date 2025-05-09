const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Servidor rodando na porta 80 🚀');
});

app.listen(80, () => {
    console.log('Servidor escutando na porta 80');
});
