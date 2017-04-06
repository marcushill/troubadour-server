import {database as db} from './startup';

export class User {
  constructor(userId) {
    this.userId = userId;
  }

  async get() {
    return db.TroubadourUser.findById(this.userId);
  }

  async updateLocation(newLocation) {
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
