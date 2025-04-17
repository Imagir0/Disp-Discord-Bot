const { google } = require('googleapis');
const path = require('path');

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '../../bot-discord-456917-fcd131adc11b.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const sheets = google.sheets({ version: 'v4', auth });

const SPREADSHEET_ID = '1JcxiviVfcYPlIWBzVBOh3RAd0m0zgLcu0hV25KJMBYc';

async function getStats(type, name) {
    let range = '';
    let nameColIndex = 0;
  
    if (type === 'équipe') {
      range = 'Équipes!B4:AA';
      nameColIndex = 1; // Colonne C = nom des équipes
    } else if (type === 'joueur') {
      range = 'Joueurs!B5:AC';
      nameColIndex = 27; // Colonne AC = id Discord
    } else {
      throw new Error('Type de statistique invalide.');
    }
  
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range,
    });
  
    const rows = res.data.values;
    if (!rows || rows.length === 0) return null;
  
    for (const row of rows) {
      const entityName = row[nameColIndex]?.toLowerCase().trim();
      if (entityName === name.toLowerCase().trim()) {
        while (row.length < 26) {
          row.push('—');
        }
        return row;
      }
    }
  
    return null;
  }
  
  module.exports = { getStats };