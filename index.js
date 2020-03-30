const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors())

app.get('/', (req, res) => res.end('Enlighto'));

app.get('/list', async (req, res) => {
    const drive = google.drive({
        version: 'v3',
        auth: process.env.API_KEY
    });

    drive.files.list({
        q: `'${process.env.PARENT_DIR_ID}' in parents`,
    }).then(({ data }) => res.json(data.files.map(x => ({ name: x.name, url: `http://drive.google.com/uc?export=view&id=${x.id}` }))))
        .catch(err => res.status(400).send(err.message));
});


app.listen(PORT, () => {
    console.log(`listening to ${PORT}...`);
});