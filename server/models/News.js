/**
 * Create Model
 */
module.exports = function(sequelize, DataTypes) {
	const Op = sequelize.Op;
	var News = sequelize.define('News', {
		title: {
			type: DataTypes.STRING,
			allowNull: false
		},
		slug: {
			type: DataTypes.STRING,
			allowNull: false
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		status: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true
		}
	}, {
		paranoid: true,
		defaultScope: {
			where: {
				status: true
			}
		}
	});

	News.associate = function(models) {

        News.belongsTo(models.Image, {
			as: 'Thumbnail',
			foreignKey: {
				name: 'image_id',
				allowNull: true
			},
        });
        
        News.belongsTo(models.User);
	}

	News.createEl = async (data, models, dataUtils) => {
		//	Create image if none already
		let image = await models.News.createImage({
			slug: data.slug,
			thumbnail: data.thumbnail,
			req: data.req,
			res: data.res
		},
		models,
		dataUtils);

		//	Create news
		const item = await models.News.create({
			title: data.title,
			slug: data.slug,
			description: data.description,
			user_id: data.user.id,
			image_id: image ? image.id : null,
		});

		return item;
	}

	News.updateEl = async (data, models, dataUtils) => {
		let image = data.thumbnail;

		if(image && !image.id){
			//	Create image if none already
			image = await models.News.createImage({
				slug: data.slug,
				thumbnail: data.thumbnail,
				req: data.req,
				res: data.res
			},
			models,
			dataUtils);
		}		

		//	Get news object
		let item = await models.News.findOne({
			where:{
				slug: {[Op.eq]: data.slug}
			},
		});
	
		//
		//	Update news
		//
		item = await item.updateAttributes({
			title: data.title,
			description: data.description,
			image_id: image ? image.id : null,
		});

		return item;
	}

	News.createImage = async (data, models, dataUtils) => {
		//
		//	ADD THUMBNAIL
		//	
		let image = null;	    
		if (data.thumbnail && data.thumbnail.data && data.thumbnail.extension && !data.thumbnail.id){
			// Timestamp to save file
			const timestamp = new Date().getTime();
		

			const thumbName = data.slug+"_thumb_"+timestamp;

			//
			//	Save file to FileSys
			// req, res, folder, blob, name, ext, parentId
			dataUtils.saveFile(data.req, data.res, "news/"+data.slug, data.thumbnail.data, thumbName, data.thumbnail.extension);

			// Create new file and add reference
			image = await models.Image.create({
				name: thumbName,
				extension: data.thumbnail.extension
			});
		}

		return image;
	}

	return News;
}