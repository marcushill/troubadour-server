import {database as db} from './startup';
import Searcher from './search';

export class Nearby {
  async getPreferences(location, maxDistance=30) {
    let preferences = await db.sequelize.query(`
    SELECT DISTINCT pr.*
          FROM troubadour_user u, preference pr
          WHERE ST_DWITHIN(u.last_location,
              ST_SetSRID(ST_MakePoint(:latitude, :longitude), 4326),
                         :maxDistance) AND u.user_id=pr.user_id;
    `, {
          model: db.Preference,
          replacements: {
            latitude: location.lat,
            longitude: location.long,
            maxDistance: maxDistance,
          },
        }
    );

    const searcher = new Searcher();
    return await searcher.fromSpotifyUris(
      preferences.map((x) => x.spotify_uri));
  }
}
