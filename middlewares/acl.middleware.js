const acl = require('acl');

const aclInstance = new acl(new acl.memoryBackend());

aclInstance.allow([
	{
		roles: 'admin',
		allows: [
			{ resources: '/polls', permissions: '*' },
			{ resources: '/polls/:id', permissions: '*' },
			{ resources: '/users', permissions: '*' },
			{ resources: '/users/:id', permissions: '*' },
		],
	},
	{
		roles: 'user',
		allows: [
			{ resources: '/me', permissions: ['get', 'post', 'put'] },
			{ resources: '/', permissions: ['get', 'post'] },
			{ resources: '/polls', permissions: ['get', 'post'] },
			{ resources: '/polls/:id', permissions: ['get', 'put', 'delete'] },
			// { resources: '/users', permissions: ['get', 'post'] },
			{ resources: '/users/:id', permissions: ['get', 'put', 'delete'] },
		],
	}
]);

module.exports = aclInstance;