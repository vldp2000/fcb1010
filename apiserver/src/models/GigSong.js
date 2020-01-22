module.exports = (sequelize, DataTypes) => {
  const GigSong = sequelize.define('GigSong', {
    id: { 
      type: DataTypes.INTEGER,  
      primaryKey: true,
      autoIncrement: true 
    },
    
    refgig: DataTypes.INTEGER,
    refsong: DataTypes.INTEGER,
    sequencenumber: DataTypes.INTEGER,
    currentFlag: DataTypes.INTEGER

  },
  {
    underscored: false,
    timestamps: false,
    reezeTableName: true,
    tableName: 'GigSong'
  })

  GigSong.associate = function (models) {
  }

  return GigSong
}
