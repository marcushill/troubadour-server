export default function(sequelize, DataTypes) {
  return sequelize.define('Playlist', {
    playlist_id: {type: DataTypes.TEXT, primaryKey: true},
    created_by: {
      type: DataTypes.TEXT,
      references: {
        model: require('./troubadour_user'),
        key: 'user_id',
      },
    },
    party_location: DataTypes.GEOGRAPHY('Point', 4326), // eslint-disable-line
    in_progress: DataTypes.BOOLEAN,
  }, {timestamps: false, tableName: 'playlist'});
}
