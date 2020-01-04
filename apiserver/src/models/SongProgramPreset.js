module.exports = (sequelize, DataTypes) => {
  const SongProgramPreset = sequelize.define('SongProgramPreset', {
    id: { 
      type: DataTypes.INTEGER,  
      primaryKey: true,
      autoIncrement: true 
    },
    refsong: DataTypes.INTEGER,
    refsongprogram: DataTypes.INTEGER,
    refinstrument: DataTypes.INTEGER,
    refinstrumentbank: DataTypes.INTEGER,
    refpreset: DataTypes.INTEGER,
    volume: DataTypes.INTEGER,
    pan: DataTypes.INTEGER,
    muteflag: DataTypes.INTEGER,
    reverbflag: DataTypes.INTEGER,
    delayflag: DataTypes.INTEGER,
    modeflag: DataTypes.INTEGER

  },
  {
    underscored: false,
    timestamps: false,
    reezeTableName: true,
    tableName: 'songprogrampreset'
  })

  SongProgramPreset.associate = function (models) {
  }

  return SongProgramPreset
}
