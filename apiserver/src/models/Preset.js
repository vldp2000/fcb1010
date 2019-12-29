module.exports = (sequelize, DataTypes) => {
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

  Preset.associate = function (models) {
  }

  return Preset
}
