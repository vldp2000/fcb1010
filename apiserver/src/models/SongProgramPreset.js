module.exports = (sequelize, DataTypes) => {
  const InstrumentBank = sequelize.import(__dirname + "/InstrumentBank")
  const Instrument = sequelize.import(__dirname + "/Instrument")
  const Preset = sequelize.import(__dirname + "/Preset")
  const SongProgram = sequelize.import(__dirname + "/SongProgram")

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
    modeflag: DataTypes.INTEGER,
    reverbvalue: DataTypes.INTEGER,
    delayvalue: DataTypes.INTEGER

  },
  {
    underscored: false,
    timestamps: false,
    reezeTableName: true,
    tableName: 'songprogrampreset'
  })
  // ------------------------------------
  SongProgramPreset.belongsTo(InstrumentBank, {
    foreignKey: 'refinstrumentbank'
  })
  InstrumentBank.hasMany(SongProgramPreset, {
    foreignKey: 'refinstrumentbank',
  });
  // ------------------------------------
  SongProgramPreset.belongsTo(Instrument, {
    foreignKey: 'refinstrument'
  })
  Instrument.hasMany(SongProgramPreset, {
    foreignKey: 'refinstrument',
  });
  // ------------------------------------
  SongProgramPreset.belongsTo(Preset, {
    foreignKey: 'refpreset'
  })
  Preset.hasMany(SongProgramPreset, {
    foreignKey: 'refpreset',
  });
   // ------------------------------------
   SongProgramPreset.belongsTo(SongProgram, {
    foreignKey: 'refsongprogram'
  })
  SongProgram.hasMany(SongProgramPreset, {
    foreignKey: 'refsongprogram',
  }); 

  SongProgramPreset.associate = function (models) {
  }

  return SongProgramPreset
}
