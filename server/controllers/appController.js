const { debug } = require('../utils/dataManipulation');
const models = require('../models/index');
const config = require('../config/config.json');
const dataUtil = require('../utils/dataManipulation');

const BPromise = require("bluebird");
const join = BPromise.join;
const blc = require('broken-link-checker');
var json2csv = require('json2csv');

exports.testLinks =  function(req, res) {
	var brokenLinks = [];
	// Handle blc test and return errors if so
	var urlChecker = new blc.UrlChecker({
		acceptedSchemes: ["http", "https"]
	}, 
	{
		link: function(result, customData){
			if (result.broken) {
				debug(customData, blc[result.brokenReason]);

				brokenLinks.push({
					type: customData.type,
					title: customData.title,
					slug: customData.slug,
					link: result.url.original,
					reason: blc[result.brokenReason] || result.brokenReason
				})

			} else if (result.excluded) {
				debug(customData, blc[result.excludedReason]);
			}

			if (customData.slug == 'asd-2'){
				debug(result.http.response.redirects);
			}

			debug(customData, result);
			debug("===");
		},
		end: function(){
			// Create a CSV file
			const fields = ["type", "title", "slug", "link", "reason"];
			const date = new Date().toJSON();
			var csv = json2csv({ data: brokenLinks, fields: fields });

			// Send e-mail with data
			dataUtil.sendEmail({
				sender: config.techEmail,
				to: config.techEmail,
				subject: "Lista de endereços quebrados",
				text: "Segue em anexo a listagem de " + brokenLinks.length + " endereços que não se encontram em funcionamento",
				attachments: [
					{
						'filename': 'broken_links_'+date+".csv",
						'content': csv
					}
				]
			}, function(err){
				if (err){
					return res.status(403).send({message:err.message})
				}else{
					return res.json({result: brokenLinks})
				}
			})
		}
	});

	// Set attributes to get
	var getAttributes = {attributes: ['slug', 'title', 'link']};

	// Get all apps, links and resources links
	join(
		models.App.findAll(getAttributes), 
		models.Link.scope("recommended").findAll(getAttributes), 
		models.Link.scope("try").findAll(getAttributes), 
		models.Resource.findAll(getAttributes),
		models.Hint.findAll(getAttributes),
		function(apps, linksRecomended, linksTry, resources, hints){

			// Create an object with seperated arrays
			const allLinksToTest = {
				apps: apps,
				sugestoes: linksRecomended,
				experimenta: linksTry,
				recursos: resources,
				dicaseutilidades: hints
			}

			// Ser variable to attach link to test
			var testLink = '';

			// Go for each array of objects and test links
			for(var key in allLinksToTest) {
				allLinksToTest[key].map(function(linkObj){
					if (linkObj.link!=null && linkObj.link.length>0){
						// Append http if doesn't exist
						testLink = linkObj.link.indexOf('http')>=0 || linkObj.link.indexOf('https')>=0 ? linkObj.link : 'http://'+linkObj.link;
						urlChecker.enqueue(testLink, '', {type: key, title: linkObj.title, slug: linkObj.slug});
					}
				});
			}
		}
	);

	
}