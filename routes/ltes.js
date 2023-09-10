const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')
router.use(bodyParser.json());
const { GoogleSpreadsheet } = require('google-spreadsheet');
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CLIENT_EMAIL = process.env.CLIENT_EMAIL;
const SHEET_ID = process.env.SHEET_ID;
// import creds from '../ltesproject.json';
const { JWT } = require('google-auth-library');
let getGoogleSheetData = async (req, res, param) => {
	try {

		const SCOPES = [
			'https://www.googleapis.com/auth/spreadsheets',
			'https://www.googleapis.com/auth/drive.file',
		];

		const jwt = new JWT({
			email: CLIENT_EMAIL,
			key: PRIVATE_KEY,
			scopes: SCOPES,
		});
		// Initialize the sheet - doc ID is the long ID in the sheets URL
		const doc = new GoogleSpreadsheet(SHEET_ID, jwt);

		// Initialize Auth - see more available options at https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
		// await doc.useServiceAccountAuth({
		// 		client_email: CLIENT_EMAIL,
		// 		private_key: PRIVATE_KEY,
		// 	  });

		await doc.loadInfo(); // loads document properties and worksheets

		const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]

		// Load all rows from the sheet
		// await sheet.loadCells();
		let result = {};
		const data = await sheet.getRows();
		data.forEach(row => {
			if (row.get('Địa chỉ email') === param || row.get('Số điện thoại') === param) {
				result = {
					id: row.get('STT'),
					name: row.get('Họ và tên'),
					email: row.get('Địa chỉ email'),
				};
			}
		});
		console.log(result);
		if (!result.id) {
			return res.status(404).send({
				status: 'error',
				message: 'Không tìm thấy thông tin',
			});
		} else {
			return res.send({
				status: 'success',
				data: result,
			});
		}
		// Do something with the data

		
	} catch (e) {
		console.error(e);
		return res.send('Oops! Something went wrong. Please check the console logs for details.');
	}
};

router.get('/:data', async (req, res) => {
	try {
		const data = req.params.data;
		await getGoogleSheetData(req, res, data);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Internal server error' });
	}
});
module.exports = router;