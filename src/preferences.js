import {database as db} from './startup';
import Searcher from './search';


export class Preferences {
  constructor(userId) {
    this.userId = userId;
  }

  async getAll() {
    let userCount = await db.TroubadourUser
                            .count({
                              where: {user_id: this.userId},
                            });
    if(userCount == 0) {
      throw new Error('User does not exist');
    }

    let preferences = await db.Preference.findAll({
      attributes: ['spotify_uri'],
      where: {
        user_id: this.userId,
      },
    });

    const searcher = new Searcher();
    return await searcher.fromSpotifyUris(
      preferences.map((x) => x.spotify_uri));
  }

  async add(newPreferences) {
    await db.TroubadourUser.findCreateFind({
      where: {
        user_id: this.userId,
      },
      defaults: {user_id: this.userId, updated_at: db.sequelize.fn('NOW')},
    });

    let finished = await db.Preference.bulkCreate(
      newPreferences.map((x) => Object.assign(x, {user_id: this.userId}))
    );

    return finished;
  }

  async delete(spotifyUris) {
    return db.Preference.destroy({
      where: {
        user_id: this.userId,
        spotify_uri: {
          $in: spotifyUris,
        },
      },
    });
  }
}
