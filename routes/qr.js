const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')
var QRCode = require('qrcode')
const bank = require('../models/bank.json');

router.use(bodyParser.json())
const qrData = {
	PFI: '000201', ///const
	PIM: '010212', //const
	TA: '54', //id
	MAI: '0010A00000072701',
	TC: '5303704',
	SC: '0208QRIBFTTA', //service code const
	CC: '5802VN', //const
	ADFT: '62',
	CRC: '6304',
}

function crc16(data, offset, length) {
	if (data == null || offset < 0 || offset > data.length - 1 || offset + length > data.length) {
		return 0;
	}
	var crc = 0xFFFF;
	for (var i = 0; i < length; ++i) {
		crc ^= data[offset + i] << 8;
		for (var j = 0; j < 8; ++j) {
			crc = (crc & 0x8000) > 0 ? (crc << 1) ^ 0x1021 : crc << 1;
		}
	}
	return crc & 0xFFFF;
}
// Convert the data string to a Uint8Array

function handleMAI(bankNumber, bankId) {
	return '0006' + bankId + '01' + bankNumber.length + bankNumber;
}

function handleAmount(amount) {
	const amountVal = amount.length < 10 ? '0' + amount.length.toString() : amount.length;
	return amountVal + amount;
}

function HandleMerchantAI(data) {
	const ADFT = (data.description ?
		qrData.ADFT +
		('08' + (data.description.length < 10 ? '0' + data.description.length.toString() : data.description.length) + data.description).length
		+ ('08' + (data.description.length < 10 ? '0' + data.description.length.toString() : data.description.length) + data.description)
		: '');
	let value =
		qrData.PFI +
		qrData.PIM +
		'38' + (qrData.MAI + handleMAI(data.bankNumber, data.bankId).length + handleMAI(data.bankNumber, data.bankId) + qrData.SC).length +
		qrData.MAI + handleMAI(data.bankNumber, data.bankId).length + handleMAI(data.bankNumber, data.bankId) +
		qrData.SC +
		qrData.TC +
		qrData.TA + handleAmount(data.amount) +
		qrData.CC +
		ADFT +
		qrData.CRC;
	var byteArray = new Uint8Array(value.length);
	for (var i = 0; i < value.length; i++) {
		byteArray[i] = value.charCodeAt(i);
	}
	value = value + crc16(byteArray, 0, byteArray.length).toString(16).toUpperCase();
	console.log(value);
	return value;
}
// Call the crc16 function with the appropriate offset and length
// var crcResult = crc16(byteArray, 0, byteArray.length);
// const data1 = data+crcResult.toString(16).toUpperCase();

router.get('/banks', async (req, res) => {
	try {
		res.json({
			data: bank.data
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Internal server error' });
	}
});

router.post('/create-qr', async (req, res) => {
	try {
		//set width height qrcode 500 x 500
		const qrCode = await QRCode.toDataURL(HandleMerchantAI(req.body), { width: 500, height: 500 });
		res.json({
			data: qrCode
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Internal server error' });
	}
});

module.exports = router;