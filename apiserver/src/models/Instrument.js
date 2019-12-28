module.exports = (sequelize, DataTypes) => {
  const Instrument = sequelize.define('Instrument', {
    id: { 
      type: DataTypes.INTEGER,  
      primaryKey: true,
      autoIncrement: true 
    },
    name: DataTypes.STRING,
    midichannel:  DataTypes.INTEGER 
  },
  {
    underscored: false,
    timestamps: false,
    reezeTableName: true,
    tableName: 'Instrument'
  })

  Instrument.associate = function (models) {
  }

  return Instrument
}
