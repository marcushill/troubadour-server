\c troubadour;

CREATE TABLE user_blacklist (
  preference_id serial PRIMARY KEY,
  user_id text REFERENCES troubadour_user ON DELETE CASCADE,
  spotify_uri text,
  name text -- more for our use than for display as we're pull this from Spotify
);
