const _ = require('lodash');
const consts = require('../config/const');

/**
 * Create Model
 */
module.exports = function(sequelize, DataTypes) {
	const Op = sequelize.Op;
	var Resource = sequelize.define('Resource', {
		title: {
			type: DataTypes.STRING,
			allowNull: false
		},
		slug: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		operation: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		operation_author: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		techResources: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		email: {
			type: DataTypes.STRING(100),
			allowNull: true,
			validate: {
				isEmail: true,
			}
		},
		organization: {
			type: DataTypes.STRING,
			allowNull: true
		},
		duration: {
			type: DataTypes.STRING(45),
			allowNull: true
		},
		highlight: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},		
		exclusive: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		embed: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		link: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		author: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		// If any moderation action
		approved: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		},
		// If any moderation action for scientific accuracy
		approvedScientific: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		},
		// If any moderation action for linguistic accuracy
		approvedLinguistic: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		},
		// If is to show or not, based on approved
		status: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true
		},
		// GDPR
		accepted_terms: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		// hide from public
		hidden: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
	}, {
		paranoid: true,
		defaultScope: {
			where: {
				status: true,
				approved: 1,
				approvedScientific: 1,
				approvedLinguistic: 1
			},
		},
		scopes: {
			normal: {
				where: {
					status: 1,
				},
			},
			approved: {
				where: {
					status: true,
					approved: 1,
					approvedScientific: 1,
					approvedLinguistic: 1
				},
			},
			all: {
				[Op.or]: [
					{
						status:false
					},
					{
						status:true
					},
					{
						approved: 1
					},
					{
						approved: 0
					},
					{
						approvedScientific: 1
					},
					{
						approvedScientific: 0
					},
					{
						approvedLinguistic: 1
					},
					{
						approvedLinguistic: 0
					}
				]
			},
			allStatusApprove: {
				[Op.or]: [
					{
						status:false
					},
					{
						status:true
					},
					{
						approved: 1
					},
					{
						approved: 0
					},
					{
						approvedScientific: 1
					},
					{
						approvedScientific: 0
					},
					{
						approvedLinguistic: 1
					},
					{
						approvedLinguistic: 0
					}
				]
			},
			generic: {
				where: {
					exclusive: false,
					highlight: false,
					status: true,
					approved: 1
				}
			},
			highlight: {
				where: {
					highlight: true,
					status: true,
					approved: 1
				}
			},
			recent: {
				order: [
					['created_at', 'DESC']
				],
				where: {
					status: true,
					approved: 1
				}
			},
			recentGeneric: {
				where: {
					exclusive: false,
					status: true,
					approved: 1
				},
				order: [
					['created_at', 'DESC']
				]
			},
			toApprove: {
				where: {
					status: true,
					approved: 0
				}
			},
			toApproveScientific: {
				where: {
					status: true,
					approved: 0,
					approvedScientific: 0
				}
			},
			toApproveLinguistic: {
				where: {
					status: true,
					approved: 0,
					approvedLinguistic: 0,
					approvedScientific: 1
				}
			},
			active: {
				where: {
					status: true
				}
			},
			pending: {
				where: {
					approved: 0,
					[Op.or]: [
						{
							approvedScientific: 0
						},
						{
							approvedLinguistic: 0
						}
					]
				}
			}
		}
	});

	Resource.associate = function(models) {

		Resource.belongsToMany(models.File, {through: models.resource_file});	
		Resource.belongsToMany(models.Term, {through: models.resource_term});	
		Resource.belongsToMany(models.Term, {through: models.resource_term, as: "Tags"});
		Resource.belongsToMany(models.Term, {through: models.resource_term, as: "Formats"});
		Resource.belongsToMany(models.Term, {through: models.resource_term, as: "TermSearch"});
		Resource.belongsToMany(models.Term, {through: models.resource_term, as: "OtherMeta"});
		Resource.belongsToMany(models.Image, {through: models.resource_image});		
		Resource.belongsTo(models.User);
		Resource.belongsTo(models.Type); 

		Resource.belongsTo(models.Image, {
			as: 'Thumbnail',
			foreignKey: {
				name: 'image_id',
				allowNull: true
			},
		});

		Resource.belongsToMany(models.User, {
			as: {
				singular: 'Favorite',
				plural: 'Favorites'
			},
			through: models.resource_favorite
		});

		Resource.hasMany(models.Rating, {
			foreignKey: {
				allowNull: false
			}
		});

		Resource.hasMany(models.Contact);

		Resource.hasMany(models.Comment, {
			as: 'Comments',
			foreignKey: {
				allowNull: true
			}
		});

		Resource.hasMany(models.Script, {
			as: 'Scripts',
			foreignKey: {
				allowNull: false
			}
		});

		/**
		 * Add custom scopes with model
		 */
		Resource.addScope('apps', {
			include: [
				{ 
					model: models.Type,
					where: {
						slug: {
							[Op.eq]: 'APPS'
						}
					}
				}
			]
		});

		Resource.addScope('tools', {
			include: [
				{ 
					model: models.Type,
					where: {
						slug: {
							[Op.eq]: 'TOOLS'
						}
					}
				}
			]
		});

		Resource.addScope('resources', {
			include: [
				{ 
					model: models.Type,
					where: {
						slug: {
							[Op.eq]: 'RESOURCES'
						}
					}
				}
			]
		});

	}

	Resource.setScript = async (models, dataUtil, req, res, resource, data, user, fileName = null) => {
		try{
			let updatedData = {
				operation: data.op_proposal,
				user_id: user.id,
				resource_id: resource.id,
				approved: user.Role.type==consts.ADMIN_ROLE ? 1 : 0,
				approvedScientific: user.Role.type==consts.ADMIN_ROLE ? 1 : 0,
				approvedLinguistic: user.Role.type==consts.ADMIN_ROLE ? 1 : 0,
				main: true,
				accepted_terms: data.accept_terms || 1,
			};

			//	Check if main script already exists
			const mainExists = await models.Script.scope("valid").findOne({
				attributes: [
					'user_id'
				],
				where: {
					resource_id: {
						[Op.eq]: resource.id
					},
					main: true
				}
			});

			//	If exists, avoid using author as current editing user
			if(mainExists){
				updatedData.user_id = mainExists.user_id;
			}
		
			const result = await models.Script.scope("valid").findOrCreate({
				where: {
					resource_id: {
						[Op.eq]: resource.id
					},
					main: true
				},
				defaults: updatedData
			});
	
			const script = result[0];
			const created = result[1];
		
			if (!created){
				await script.updateAttributes(updatedData);
			}
		
			// TERMS is the same as domains, subjects and years
			let finalTerms = (data.terms || []).concat(data.targets || []);
			dataUtil.debug(finalTerms,"RESOURCE:SCRIPTS", "TERMS");
			await script.setTerms(finalTerms);

			/* //	=========================================
			//	Add resource title to tags of not already
			//	=========================================
			let finalTags = _.cloneDeep(data.tags);

			if(finalTags.filter(tag => tag===data.title).length==0){
				finalTags.push(data.title);
			}
			dataUtil.debug(finalTags, 'Resources','CREATE'); */
			//	=========================================
			//	END
			//	=========================================

			await models.Script.addTags(script, models, data.tags, dataUtil);
	
			//
			//	Save file to FileSys
			//
			if (data.script_file && data.script_file.data && !data.script_file.id && data.script_file.extension && fileName){
                //  Delete any previous file
                const curFiles = await script.getFiles()
                await Promise.all(curFiles.map(async function(file){
                    await file.destroy();
                    debug("=== Deleting file @: scripts/"+resource.slug+"/"+file.name+"."+file.extension + " ===")

                    //
                    //	Delete physical files
                    //
                    //dataUtil.rmFile("scripts/"+resource.dataValues.slug, file.name+"."+file.extension);
                }));
                await script.setFiles([]);

                //  Add new file
				const fileToUpload = {
					name: fileName,
					extension: data.script_file.extension				
				}
	
				// Create new file and add reference
				const newFile = await models.File.create(fileToUpload);
				await script.addFile(newFile);
	
				// req, res, folder, blob, name, ext, parentId
				dataUtil.saveFile(req, res, "scripts/"+resource.slug, data.script_file.data, fileName, data.script_file.extension);	
			}
		
			return script;
		}catch(err){
			return {
				err: err.message,
				stack: process.env.NODE_ENV==='development' || process.env.NODE_ENV==='staging' ? err.stack : null
			};
		}
	}

	return Resource;
}
