/**
 * Create Model
 */
module.exports = function(sequelize, DataTypes) {
  const Op = sequelize.Op;
  var Script = sequelize.define(
    'Script',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: true
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      operation: {
        type: DataTypes.TEXT,
        allowNull: false
      },
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
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      main: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      // GDPR
      accepted_terms: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    },
    {
      paranoid: true,
      defaultScope: {
        where: {
          status: true,
          approved: 1,
          approvedScientific: 1,
          approvedLinguistic: 1
        }
      },
      scopes: {
        normal: {
          where: {
            status: 1
          }
        },
        valid: {
          [Op.or]: [
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
          ],
          status: true
        },
        all: {
          [Op.or]: [
            {
              status: false
            },
            {
              status: true
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
    }
  );

  Script.associate = function(models) {
    Script.belongsToMany(models.Term, { through: models.script_term });
    Script.belongsToMany(models.File, { through: models.script_file });
    Script.belongsToMany(models.Term, {
      through: models.script_term,
      as: 'ScriptsTags'
    });
    Script.belongsToMany(models.Term, {
      through: models.script_term,
      as: 'ScriptsTermSearch'
    });
    Script.belongsTo(models.User);
    Script.belongsTo(models.Resource);
  };

  Script.addTags = async (script, models, tags, dataUtil) => {
    let items = await models.Term.findAll({
      include: [
        {
          model: models.Taxonomy,
          required: true,
          where: {
            slug: {
              [Op.like]: '%tags%'
            }
          },
          include: [
            {
              model: models.Type,
              where: {
                slug: { [Op.eq]: 'RESOURCES' }
              }
            }
          ]
        }
      ],
      where: {
        title: {
          [Op.in]: tags
        }
      }
    });

    var existingTags = [];
    var newTags = tags;

    //
    //	Replace repeated tags for the ones form DB
    //
    for (var tag of items) {
      var index = dataUtil
        .arrayToLowercase(newTags)
        .indexOf(tag.title.toLowerCase());

      if (index >= 0) {
        //	Remove from new
        newTags.splice(index, 1);

        //	Add to existing
        existingTags.push(tag.id);
      }
    }

    let tagsTax = await models.Taxonomy.findOne({
      where: {
        slug: {
          [Op.like]: '%tags%'
        }
      },
      include: [
        {
          model: models.Type,
          where: {
            slug: { [Op.like]: 'RESOURCES' }
          }
        }
      ]
    });

    //
    //	Prepare new tags to insert
    //
    newTags = await Promise.all(
      newTags.map(async function(tag) {
        return {
          title: tag,
          taxonomy_id: tagsTax.id,
          slug: await dataUtil.createSlug(tag, models.Term, null, false, models)
        };
      })
    );

    //
    //	Remove all tags and insert new ones
    //
    await script.addTerms(existingTags);

    await Promise.all(
      newTags.map(async function(tag) {
        let newTag = await models.Term.create(tag);
        await script.addTerms(newTag);
      })
    );
  };

  return Script;
};
