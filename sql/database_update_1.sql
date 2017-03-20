\c troubadour;

ALTER TABLE "preference"
ADD CONSTRAINT user_uri_unique UNIQUE(user_id, spotify_uri);
