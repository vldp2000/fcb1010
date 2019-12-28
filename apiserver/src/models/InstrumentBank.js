module.exports = (sequelize, DataTypes) => {
  const InstrumentBank = sequelize.define('InstrumentBank', {
    id: { 
      type: DataTypes.INTEGER,  
      primaryKey: true,
      autoIncrement: true 
    },
    name: DataTypes.STRING,
    number:DataTypes.INTEGER ,
    refinstrument:  DataTypes.INTEGER 
  },
  {
    underscored: false,
    timestamps: false,
    reezeTableName: true,
    tableName: 'InstrumentBank'
  })

  InstrumentBank.associate = function (models) {
  }

  return InstrumentBank
}
