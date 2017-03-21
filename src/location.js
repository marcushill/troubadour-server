import {database as db} from './startup';

export class UserLocation {
  constructor(userId) {
    this.userId = userId;
  }

  async update(newLocation) {
    let finished = db.TroubadourUser.upsert({
        user_id: this.userId,
        updated_at: db.sequelize.fn('NOW'),
        last_location: {
          type: 'Point',
          coordinates: [newLocation.lat, newLocation.long],
          crs: {type: 'name', properties: {name: 'EPSG:4326'}},
        },
    });

    return finished;
  }
}
