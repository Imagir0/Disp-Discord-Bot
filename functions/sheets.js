const { google } = require('googleapis');
const path = require('path');

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '../../bot-discord-456917-fcd131adc11b.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const sheets = google.sheets({ version: 'v4', auth });

const SPREADSHEET_ID = '1JcxiviVfcYPlIWBzVBOh3RAd0m0zgLcu0hV25KJMBYc';

async function getUserStats(username) {
  const range = 'Équipes!C4:V'; // C contient le nom, D à V les stats


  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range,
  });

  const rows = res.data.values;
  if (!rows || rows.length === 0) return null;

  // Chercher la ligne contenant le nom du joueur
  for (const row of rows) {
    const playerName = row[0]?.toLowerCase().trim();
    if (playerName === username.toLowerCase().trim()) {
      // S'assurer que la ligne contient bien toutes les données attendues (jusqu'à V → 19 valeurs)
      while (row.length < 19) {
        row.push('—'); // Ajoute des tirets pour éviter les erreurs si des colonnes sont vides
      }
      return row;
    }
  }

  return null; // Aucun joueur trouvé
}

module.exports = { getUserStats };
