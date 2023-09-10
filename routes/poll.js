const express = require('express');
const router = express.Router();
const pollController = require('../controllers/poll.Controller');
const bodyParser = require('body-parser')
const AuthMiddleware = require('../middlewares/auth.middleware');

router.use(bodyParser.json())
router.post('/', [AuthMiddleware.authorize],async (req, res) => {
	try {
		await pollController.createNewPoll(req, res);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Internal server error' });
	}
});
router.get('/', async (req, res) => {
	try {
		await pollController.getPolls(req, res);
	}
	catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Internal server error' });
	}
});
router.get('/:id', async (req, res) => {
	try {
		await pollController.getPollById(req, res);
	}
	catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Internal server error' });
	}
});

router.delete('/:id', async (req, res) => {
	try {
		await pollController.deletePoll(req, res);
	}
	catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Internal server error' });
	}
});

router.put('/:id', async (req, res) => {
	try {
		await pollController.updatePoll(req, res);
	}
	catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Internal server error' });
	}
});
module.exports = router;