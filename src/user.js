import {database as db} from './startup';
import {TroubadourError} from './helpers';

export class User {
  constructor(userId) {
    this.userId = userId;
  }

  async get() {
    return db.TroubadourUser.findById(this.userId);
  }

  async updateLocation(newLocation) {
    if(!( newLocation instanceof Object) ||
       ! Number.isFinite(newLocation.lat) ||
       ! Number.isFinite(newLocation.long)) {
         throw new TroubadourError('The entered location is invalid. ' +
         'See docs at https://api.troubadour.tk/docs. ', 400);
    }
    await db.TroubadourUser.upsert({
        user_id: this.userId,
        updated_at: db.sequelize.fn('NOW'),
        last_location: newLocation,
    });

    return true;
  }

  async create() {
    return await db.TroubadourUser.upsert({
      user_id: this.userId,
      updated_at: db.sequelize.fn('NOW'),
    });
  }
}
