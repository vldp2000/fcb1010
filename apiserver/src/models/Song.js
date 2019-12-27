module.exports = (sequelize, DataTypes) => {
  const Song = sequelize.define('Song', {
    id: { 
      type: DataTypes.INTEGER,  
      primaryKey: true,
      autoIncrement: true 
    },
    name: DataTypes.STRING,
    tempo:  DataTypes.INTEGER ,
    lirycs: DataTypes.TEXT,
    tabs: DataTypes.TEXT
  },
  {
    reezeTableName: true,
    tableName: 'Song'
  })

  Song.associate = function (models) {
  }

  return Song
}
