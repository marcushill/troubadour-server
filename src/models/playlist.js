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
    in_progress: DataTypes.BOOLEAN,
    party_location: {
      type: DataTypes.GEOGRAPHY('Point', 4326), // eslint-disable-line new-cap
      get() {
        let partyLocation = this.getDataValue('party_location');
        if(!partyLocation) return null;
        let coords = this.getDataValue('party_location').coordinates;
        return {
          lat: coords[0],
          long: coords[1],
          radius: this.getDataValue('radius')};
      },
      set(val) {
        this.setDataValue('party_location', {
          type: 'Point',
          coordinates: [val.lat, val.long],
          crs: {type: 'name', properties: {name: 'EPSG:4326'}},
        });
        if(val.radius) {
          this.setDataValue('radius', val.radius);
        }
      },
    }, // eslint-disable-line
    radius: DataTypes.INTEGER,
  }, {timestamps: false, tableName: 'playlist'});
}
