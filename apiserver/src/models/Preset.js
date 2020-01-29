module.exports = (sequelize, DataTypes) => {
  const InstrumentBank = sequelize.import(__dirname + "/InstrumentBank")
  const Instrument = sequelize.import(__dirname + "/Instrument")

  const Preset = sequelize.define('Preset', {
    id: { 
      type: DataTypes.INTEGER,  
      primaryKey: true,
      autoIncrement: true 
    },
    refinstrument: DataTypes.INTEGER,
    refinstrumentbank: DataTypes.INTEGER,

    name: DataTypes.STRING,
    midipc:  DataTypes.INTEGER,
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
