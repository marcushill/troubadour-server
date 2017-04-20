import {database as db} from './startup';
import Searcher from './search';
import {TroubadourError} from './helpers';


export class UserBlacklist {
  constructor(userId) {
    this.userId = userId;
  }

  async getAll() {
    let userCount = await db.TroubadourUser
                            .count({
                              where: {user_id: this.userId},
                            });
    if(userCount == 0) {
      throw new TroubadourError('User does not exist', 400);
    }

    let preferences = await db.UserBlacklist.findAll({
      attributes: ['spotify_uri'],
      where: {
        user_id: this.userId,
      },
    });

    const searcher = new Searcher();
    return await searcher.fromSpotifyUris(
      preferences.map((x) => x.spotify_uri));
  }

  async add(newBlacklist) {
    await db.TroubadourUser.findCreateFind({
      where: {
        user_id: this.userId,
      },
      defaults: {user_id: this.userId, updated_at: db.sequelize.fn('NOW')},
    });
    let finished = await db.UserBlacklist.bulkCreate(
      newBlacklist.map((x) => Object.assign(x, {user_id: this.userId}))
    );

    return finished;
  }

  async delete(spotifyUris) {
    return db.UserBlacklist.destroy({
      where: {
        user_id: this.userId,
        spotify_uri: {
          $in: spotifyUris,
        },
      },
    });
  }
}
