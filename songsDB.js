const { google } = require('googleapis');
const _ = require('lodash');

const COLOUMN_MAPPER = {
    title: 0,
    artist: 1,
    fileId: 2,
    tags: 3
};

const getDb = () => {
    const sheets = google.sheets({
        version: 'v4',
        auth: process.env.API_KEY
    });
    return sheets.spreadsheets.values.get({
        spreadsheetId: process.env.SHEET_DB_ID,
        range: 'Sheet1!A2:D',
    }).then(response => response.data.values.map(x => ({
        title: x[COLOUMN_MAPPER['title']],
        artist: x[COLOUMN_MAPPER['artist']],
        fileId: x[COLOUMN_MAPPER['fileId']],
        url: `http://drive.google.com/uc?export=view&id=${x[COLOUMN_MAPPER['fileId']]}`,
        tags: x[COLOUMN_MAPPER['tags']].split(',').map(x => x.trim())
    })))
};

const getCategories = () => getDb().then(rows => _.chain(rows).map(x => x.tags).flatten().uniq());

const getSongsFor = (category) =>  getDb().then(rows => rows.filter(x => x.tags.find(tag => tag.toLowerCase() == category.toLowerCase())));

module.exports = {
    getCategories,
    getSongsFor
}
