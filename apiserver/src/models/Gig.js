module.exports = (sequelize, DataTypes) => {
  const Gig = sequelize.define('Gig', {
    id: { 
      type: DataTypes.INTEGER,  
      primaryKey: true,
      autoIncrement: true 
    },
    name: DataTypes.STRING,
    gigdate:  DataTypes.DATEONLY
  },
  {
    reezeTableName: true,
    tableName: 'Gig',
    timestamps: false,
    underscored: false
  })

  Gig.associate = function (models) {
  }

  return Gig
}
