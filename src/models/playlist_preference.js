export default function(sequelize, DataTypes) {
  return sequelize.define('playlist_preference', {
    playlist_id: {
      type: DataTypes.TEXT,
      references: {
        model: require('./playlist'),
        key: 'user_id',
      },
    },
    preference_id: {
      type: DataTypes.INTEGER,
      references: {
        model: require('./preference'),
        key: 'user_id',
      },
    },
  }, {timestamps: false, tableName: 'playlist_preference'});
}
