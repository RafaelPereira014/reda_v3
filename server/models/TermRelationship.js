/**
 * Create Model
 */
module.exports = function(sequelize) {
	var TermRelationship = sequelize.define('TermRelationship', {
	}, {
		paranoid: true
	});

	TermRelationship.associate = function(models) {
		TermRelationship.belongsToMany(models.Term, {
			through: models.terms_relation,
			foreignKey: 'term_relationship_id'
		});
	}

	TermRelationship.createEl = async (data, models) => {
		const relationship = await models.TermRelationship.create();
		
		//	Add terms
		await Promise.all(data.terms.map(async term => {
			//	Add term
			await relationship.addTerm(term.term_id, { through: { level: term.level }});
		}));

		return relationship;
	}

	TermRelationship.updateEl = async (data, models, dataUtils = null) => {
		const relationship = await models.TermRelationship.findOne({
			where: {
				id: data.id
			}
		});

		//	Remove term if exists
		let relTerms = await relationship.getTerms();

		if(relTerms){
			await relationship.setTerms([]);	
		}

		//	Add terms
		await Promise.all(data.terms.map(async term => {
			//	Add term
			await relationship.addTerm(term.term_id, { through: { level: term.level }});
		}));


		return relationship;
	}

	return TermRelationship;
}
