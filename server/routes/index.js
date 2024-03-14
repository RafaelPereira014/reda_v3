var routes = function(app){
	app.use('/api/', require('./initial.js'));
	app.use('/api/resources', require('./resources.js'));
	app.use('/api/scripts', require('./scripts.js'));
	app.use('/api/users', require('./users.js'));
	app.use('/api/terms', require('./terms.js'));
	app.use('/api/taxonomies', require('./taxonomies.js'));
	app.use('/api/apps', require('./apps.js'));
	app.use('/api/tools', require('./tools.js'));
	app.use('/api/comments', require('./comments.js'));
	app.use('/api/feedback', require('./feedback.js'));
	app.use('/api/sitemap', require('./sitemap.js'));
	app.use('/api/messages', require('./messages.js'));
	app.use('/api/roles', require('./roles.js'));
	app.use('/api/contacts', require('./contacts.js'));
	app.use('/api/dashboard', require('./dashboard.js'));
	app.use('/api/badwords', require('./badwords.js'));
	app.use('/api/types', require('./types.js'));
	app.use('/api/relationships', require('./termRelationships.js'));
	app.use('/api/news', require('./news.js'));
}

module.exports = routes;