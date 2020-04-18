const { google } = require('googleapis');

const SONGS_COLOUMN_MAPPER = {
    title: 0,
    artist: 1,
    fileId: 2,
    tags: 3,
    language: 4,
    description: 4
};

const CATEGORIES_COLOUMN_MAPPER = {
    title: 0,
    description: 1,
    imageUrl: 2
};

const getSongs = () => {
    const sheets = google.sheets({
        version: 'v4',
        auth: process.env.API_KEY
    });
    return sheets.spreadsheets.values.get({
        spreadsheetId: process.env.SHEET_DB_ID,
        range: 'Audios!A2:F',
    }).then(response => response.data.values.map(x => ({
        title: x[SONGS_COLOUMN_MAPPER['title']],
        artist: x[SONGS_COLOUMN_MAPPER['artist']],
        fileId: x[SONGS_COLOUMN_MAPPER['fileId']],
        url: `http://drive.google.com/uc?export=view&id=${x[SONGS_COLOUMN_MAPPER['fileId']]}`,
        tags: x[SONGS_COLOUMN_MAPPER['tags']].split(',').map(x => x.trim()),
        language: x[SONGS_COLOUMN_MAPPER['language']],
        description: x[SONGS_COLOUMN_MAPPER['description']],
    })))
};

const getCategories = () => {
    const sheets = google.sheets({
        version: 'v4',
        auth: process.env.API_KEY
    });
    return sheets.spreadsheets.values.get({
        spreadsheetId: process.env.SHEET_DB_ID,
        range: 'Categories!A2:C',
    }).then(response => response.data.values.map(x => ({
        title: x[CATEGORIES_COLOUMN_MAPPER['title']],
        description: x[CATEGORIES_COLOUMN_MAPPER['description']],
        imageUrl: x[SONGS_COLOUMN_MAPPER['imageUrl']]
    })))
};

const getSongsFor = (category) =>  getSongs().then(rows => rows.filter(x => x.tags.find(tag => tag.toLowerCase() == category.toLowerCase())));

module.exports = {
    getCategories,
    getSongsFor
}
