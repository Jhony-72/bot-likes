const express = require('express');
const cron = require('node-cron');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let miFreeFireID = ""; 

app.post('/guardar-id', (req, res) => {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: "ID inválido" });
    miFreeFireID = id;
    res.json({ mensaje: `ID ${miFreeFireID} guardado. Ciclo de 24h activo.` });
});

// Tarea automática: Se ejecuta cada 24 horas a la medianoche (00:00)
cron.schedule('0 0 * * *', async () => {
    if (!miFreeFireID) return;
    try {
        // NOTA: Esta URL es un ejemplo. Aquí irá el enlace de la API de likes que consigas.
        const urlApiFreeFire = `https://freefirelikes.com{miFreeFireID}`;
        await axios.get(urlApiFreeFire);
        console.log("Likes enviados automáticamente.");
    } catch (error) {
        console.error("Error al enviar likes:", error.message);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo`));
