const { google } = require('googleapis');
const path = require('path');

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '../../bot-discord-456917-fcd131adc11b.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const sheets = google.sheets({ version: 'v4', auth });

// 🗂️ Identifiants des saisons
const SPREADSHEET_ID_S4 = '1JcxiviVfcYPlIWBzVBOh3RAd0m0zgLcu0hV25KJMBYc';
const SPREADSHEET_ID_S5 = '1XvOUvv2CVSgSHercRIUsahlYNXTxeVdTHzb6bnTzKlM';

async function getStats(saison, type, name) {
  let SPREADSHEET_ID;
  let range = '';
  let nameColIndex = 0;

  console.log('Valeur reçue pour saison :', saison);
  // Nettoyer le texte reçu
  const saisonClean = saison.trim().toLowerCase();

  if (saisonClean === 's4') {
    SPREADSHEET_ID = SPREADSHEET_ID_S4;
  } else if (saisonClean === 's5') {
    SPREADSHEET_ID = SPREADSHEET_ID_S5;
  } else {
    console.error('Saison reçue :', saison);
    throw new Error('Saison invalide. Utilisez S4 ou S5.');
  }

  // 🟦 Choisir la bonne feuille et colonne selon le type
  if (type === 'équipe') {
    range = 'Équipes!B4:AA';
    nameColIndex = 1; // Colonne C = nom des équipes
  } else if (type === 'joueur') {
    range = 'Stats joueur bot!B5:BB';
    nameColIndex = 3; // Colonne E = id Discord ou nom joueur
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
      while (row.length < 60) { // on étend pour éviter les erreurs d'index
        row.push('—');
      }
      return row;
    }
  }

  return null;
}

module.exports = { getStats };
