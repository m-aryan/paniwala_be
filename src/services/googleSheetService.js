import { google } from 'googleapis';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Recreate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, '../../jeevraksha-461908-2165aa6ea477.json'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

export const addToGoogleSheet = async (data) => {
    try {
        const authClient = await auth.getClient();
        const sheets = google.sheets({ version: 'v4', auth: authClient });

        const spreadsheetId = '1tBVGtSyjg_Q_3lXxO_qGc62jz7nrb6ZCvC0EWNOzIrw';
        const range = 'Sheet1';

        const values = [
            [data.firstName, data.lastName, data.email, data.organization || '', data.projectType, data.projectDetails, data.newsletter || false]
        ];

        sheets.spreadsheets.values.append({
            spreadsheetId,
            range,
            valueInputOption: 'RAW',
            resource: { values },
        });

        console.log('Data added to Google Sheets');
    } catch (error) {
        console.error('Error adding data to Google Sheets:', error);
        throw error;
    }
};
