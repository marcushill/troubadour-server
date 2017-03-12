export default function(sequelize, DataTypes) {
  return sequelize.define('preference', {
    preference_id: {type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true},
    spotify_id: DataTypes.TEXT,
    name: DataTypes.DATE,
    user_id: {
      type: DataTypes.TEXT,
      references: {
        model: require('./troubadour_user'),
        key: 'user_id',
      },
    },
  }, {timestamps: false, tableName: 'preference'});
}
