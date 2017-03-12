DROP DATABASE troubadour;
CREATE DATABASE troubadour;
\c troubadour;
CREATE EXTENSION postgis;

CREATE TABLE troubadour_user (
  user_id text PRIMARY KEY,
  spotify_id text,
  last_location geography(POINT,4326),
  updated_at timestamp with time zone
);

CREATE TABLE preference (
  preference_id serial PRIMARY KEY,
  user_id text REFERENCES troubadour_user ON DELETE CASCADE,
  spotify_id text,
  name text
);

CREATE TABLE playlist (
  playlist_id text PRIMARY KEY, -- Spotify ID
  created_by text REFERENCES troubadour_user ON DELETE CASCADE,
  in_progress boolean,
  party_location geography(POLYGON, 4326)
);

CREATE TABLE playlist_preference (
  playlist_id text REFERENCES playlist,
  preference_id integer REFERENCES preference
);
