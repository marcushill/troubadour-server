\c troubadour;

DROP TABLE IF EXISTS playlist CASCADE;
CREATE TABLE playlist (
  playlist_id text PRIMARY KEY, -- Spotify ID
  created_by text REFERENCES troubadour_user ON DELETE CASCADE,
  in_progress boolean,
  party_location geography(POINT, 4326),
  radius integer
);

DROP INDEX IF EXISTS playlist_party_location_index;
CREATE INDEX playlist_party_location_index
  ON playlist
  USING gist(party_location);

DROP INDEX IF EXISTS troubadour_user_last_location_index;
CREATE INDEX troubadour_user_last_location_index
  ON troubadour_user
  USING gist(last_location);
