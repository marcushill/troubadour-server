import {database as db} from './startup';
import Searcher from './search';

export class Nearby {
  constructor(userId) {
    this.userId = userId;
  }

  async getPreferences(location, maxDistance=30) {
    let preferences = await db.sequelize.query(`
    SELECT DISTINCT pr.*
          FROM troubadour_user u, preference pr
          WHERE ST_DWITHIN(u.last_location,
              ST_SetSRID(ST_MakePoint(:latitude, :longitude), 4326),
                         :maxDistance) AND u.user_id=pr.user_id
          AND pr.spotify_uri NOT IN (
            select spotify_uri from user_blacklist where user_id=:user_id
          );
    `, {
          model: db.Preference,
          replacements: {
            latitude: location.lat,
            longitude: location.long,
            maxDistance: maxDistance,
            user_id: this.userId,
          },
        }
    );

    return preferences;
  }

  async getDistinctPreferences(location, maxDistance=30) {
    const preferenceUris = await db.sequelize.query(`
    SELECT DISTINCT pr.spotify_uri
          FROM troubadour_user u, preference pr
          WHERE ST_DWITHIN(u.last_location,
              ST_SetSRID(ST_MakePoint(:latitude, :longitude), 4326),
                         :maxDistance) AND u.user_id=pr.user_id
         AND pr.spotify_uri NOT IN (
           select spotify_uri from user_blacklist where user_id=:user_id
         );
    `, {
          type: db.sequelize.QueryTypes.SELECT,
          replacements: {
            latitude: location.lat,
            longitude: location.long,
            maxDistance: maxDistance,
            user_id: this.userId,
          },
        }
    );
    const searcher = new Searcher();
    return await searcher.fromSpotifyUris(
      preferenceUris.map((x) => x.spotify_uri));
  }
}
