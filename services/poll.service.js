const PollRepository = require('../repositories/poll.repository');
const TokenService = require('../services/token.service');

const GetPolls = async () => {
	try {
		return await PollRepository.getPolls();
	} catch (error) {
		console.log(error);
		throw new Error('Internal server error');
	}
}
const Create = async (poll, userId) => {
	try {
		const options = poll.options;
		poll.user_id = userId;
		const pollId = await PollRepository.createPoll(poll, options);
		console.log(pollId);
		return await PollRepository.getPollById(pollId);
	} catch (error) {
		console.log(error);
		throw new Error('Internal server error');
	}
}

const GetPollById = async (id) => {
	try {
		return await PollRepository.getPollById(id);
	} catch (error) {
		console.log(error);
		throw new Error('Internal server error');
	}
}

const DeletePoll = async (id) => {
	try {
		return await PollRepository.deletePoll(id);
	} catch (error) {
		console.log(error);
		throw new Error('Internal server error');
	}
}

const UpdatePoll = async (id, pollA) => {
	try {
		const poll = PollRepository.getPollById(id);
		if (!poll){
			throw new Error('Poll not found');
		}
		let reqOptions = pollA.options;
		let listIdNewOptions = reqOptions.map((item) => {
			return item.id 
		});
		const currentOptions = await PollRepository.getOptionsByPollId(id);
		let optionsDeleted = currentOptions.map((item) => {
			if(!(item.id in listIdNewOptions)){ 
				console.log(item.id);
				return item.id;}
		})
		poll.title = pollA.title;
		poll.question = pollA.question;
		poll.thumbnail = pollA.thumbnail;
		console.log(optionsDeleted);
		return await PollRepository.updatePoll(id, poll, reqOptions, optionsDeleted);

		if (poll){
		}
	} catch (error) {
		console.log(error);
		throw new Error('Internal server error');
	}
}
module.exports = {
	Create,
	GetPollById,
	DeletePoll,
	UpdatePoll,
	GetPolls
}