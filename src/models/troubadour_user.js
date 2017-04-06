export default function(sequelize, DataTypes) {
  return sequelize.define('TroubadourUser', {
    user_id: {type: DataTypes.TEXT, primaryKey: true},
    spotify_id: DataTypes.TEXT,
    last_location: {
      type: DataTypes.GEOGRAPHY('Point', 4326), // eslint-disable-line new-cap
      get() {
        let lastLocation = this.getDataValue('last_location');
        if(!lastLocation) {
          return null;
        }
        let coords = lastLocation.coordinates;
        return {lat: coords[0], long: coords[1]};
      },
      set(val) {
        this.setDataValue('last_location', {
          type: 'Point',
          coordinates: [val.lat, val.long],
          crs: {type: 'name', properties: {name: 'EPSG:4326'}},
        });
      },
    }, // eslint-disable-line
    updated_at: DataTypes.DATE,
  }, {timestamps: false, tableName: 'troubadour_user'});
}
