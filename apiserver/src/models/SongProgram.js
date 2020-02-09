module.exports = (sequelize, DataTypes) => {
  const SongProgram = sequelize.define('SongProgram', {
    id: { 
      type: DataTypes.INTEGER,  
      primaryKey: true,
      autoIncrement: true 
    },
    name: DataTypes.STRING,
    midipedal: DataTypes.INTEGER,
    refsong: DataTypes.INTEGER,
    tytle: DataTypes.STRING
  },
  
  {
    underscored: false,
    timestamps: false,
    reezeTableName: true,
    tableName: 'SongProgram'
  })

  SongProgram.associate = function (models) {
  }

  return SongProgram
}
