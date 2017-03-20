import {database as db} from './startup';

export class Location {
  constructor(userId) {
    this.userId = userId;
  }

  async add(newLocation) {
    await db.TroubadourUser.findCreateFind({
      where: { user_id: this.userId, },
      defaults: {user_id: this.userId, updated_at: db.sequelize.fn('NOW')},
    });

    let finished = db.TroubadourUser.upsert({
        user_id: this.userId, 
        updated_at: db.sequelize.fn('NOW'), 
        last_location: {
          type: 'Point',
          coordinates: [newLocation.lat, newLocation.long],
          crs: { type: 'name', properties: { name: 'EPSG:4326'} }
        }
    })
    
    return finished;
  }
}