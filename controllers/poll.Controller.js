const { get } = require('../routes/auth');
const PollService = require('../services/poll.service');
const TokenService = require('../services/token.service');

const getPolls = async (req, res) => {
	try {
		const polls = await PollService.GetPolls();
		if (polls){
			res.send({
				data: polls
			});
		} else {
			res.status(400).json({message: 'Polls not found'});
		}
	} catch (e) {
		console.log(e.message);
		res.status(500).json({ message: 'Internal server error'});
	}
};
const createNewPoll = async (req, res) => {
	try {
		const userId = TokenService.getInfoFromToken(req).id;
		console.log("userId", userId)
		if (!userId){
			res.status(400).json({message: 'User not found'});
			return;
		}
		const poll = await PollService.Create(req.body, userId);
		console.log("poll", poll)
		if (poll){
			res.send({ 
				data:poll
			});
		}
	} catch (e) {
		console.log("ẻoor", e);
		res.status(500).json({ message: 'Internal server error'});
	}
};

const getPollById = async (req, res) => {
	try {
		const poll = await PollService.GetPollById(req.params.id);
		if (poll){
			res.send({
				data: poll
			});
		} else {
			res.status(400).json({message: 'Poll not found'});
		}
	} catch (e) {
		console.log(e.message);
		res.status(500).json({ message: 'Internal server error'});
	}
}

const deletePoll = async (req, res) => {
	try {
		await PollService.DeletePoll(req.params.id);
	} catch (e) {
		console.log(e.message);
		res.status(500).json({ message: 'Internal server error'});
	}
}

const updatePoll = async (req, res) => {
	try {
		const pollId = req.params.id;
		const updatePoll = req.body;
		const data = await PollService.UpdatePoll(pollId, updatePoll);
		res.send({
			data: data
		});
	} catch (e) {
		console.log(e.message);
		res.status(500).json({ message: 'Internal server error'});
	}
}
module.exports = {
	createNewPoll,
	getPollById,
	deletePoll,
	updatePoll,
	getPolls
}