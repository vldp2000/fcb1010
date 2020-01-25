module.exports = (sequelize, DataTypes) => {

  // const InstrumentBank = require('./InstrumentBank').InstrumentBank
  // const Instrument = require('./Instrument').Instrument
  const InstrumentBank = sequelize.import(__dirname + "/InstrumentBank")
  const Instrument = sequelize.import(__dirname + "/Instrument")

  const Preset = sequelize.define('Preset', {
    id: { 
      type: DataTypes.INTEGER,  
      primaryKey: true,
      autoIncrement: true 
    },
    name: DataTypes.STRING,
    midipc:  DataTypes.INTEGER,
    refinstrumentbank: DataTypes.INTEGER,
    refinstrument: DataTypes.INTEGER,
    isDefault: DataTypes.INTEGER
  },
  {
    underscored: false,
    timestamps: false,
    reezeTableName: true,
    tableName: 'Preset'
  })

  Preset.belongsTo(InstrumentBank, {
    foreignKey: 'refinstrumentbank'
  })
  InstrumentBank.hasMany(Preset, {
    foreignKey: 'refinstrumentbank',
  });

  Preset.belongsTo(Instrument, {
    foreignKey: 'refinstrument'
  })
  Instrument.hasMany(Preset, {
    foreignKey: 'refinstrument',
  });


  Preset.associate = function (models) {
  }

  return Preset
}

// Category.hasMany(Ingredient, {
//   foreignKey: 'category_id',
// });
// Ingredient.belongsTo(Category, {
//   foreignKey: 'category_id',
// });