# Troubadour Server

This is the back-end server for the troubadour project. For now, this repo only contains the node server, but eventually it should contain everything needed to run the backend including help for setting up the relevant dependent services.

## Dependencies
- A somewhat recent version of node and npm
- Redis
- Postgres w/ PostGIS
- Docker (Optional, but it's really easy to run the Redis and Postgres in a container)
- A Spotify Client ID and Secret
- A Postgresql Client. I use the ordinary psql commandline client. (I think there's a way to use the one in docker image, but I don't know how.)


## Setup Instructions
1. Install the dependencies (make sure to actually start the docker daemon).
2. Pull down the code.
```bash
git clone https://github.com/marcushill/troubadour-server.git
cd troubadour-server
npm install
```
3. Pull and run the redis docker image.
```bash
docker pull redis
docker run -d -p 6379:6379 -v ~/redis_data:/data --name redis redis
```
This will start up a docker container running redis listening on port 6379 of your machine with the data dumps stored in `~/redis_data`.

4. Pull and run the postgis docker image.

  This assumes you've set the `PGPASSWD` environment variable to something earlier. You can do that with export. Just remember what you used.

  ```bash
  docker pull geographica/postgis
  export PG_HBA="local all all trust#host all all 0.0.0.0/0 trust#host all all 127.0.0.1/32 trust#host all all ::1/128 trust"
   docker run -d -p 5432:5432 -P --name test_pgcontainer -e "POSTGRES_PASSWD=${PGPASSWD}" geographica/postgis
  ```

  This causes the Postgres database to listen on port 5432 on your machine. If you want more fine grained control, checkout the [documentation for the PostGIS](https://hub.docker.com/r/geographica/postgis/)

5. Setup your database.

  Using your postgres client, run each of the files in `sql/` in order starting with  `create_tables.sql` and then each of the `database_update` scripts in numbered order. At the time of writing, that looks like this.

  ```bash
   psql -h localhost -U postgres -f sql/create_tables.sql
   psql -h localhost -U postgres -f sql/databse_update_1.sql
  ```

6. Next create a file named `.env` on the same level as the `package.json`. Put the following the file.

  ```bash

  SPOTIFY_CLIENT=<Spotify Client ID>
  SPOTIFY_SECRET=<Spotify Client Secret>
  CONNECTION_STRING=postgres://postgres:<whatever you password is>@localhost:5432/troubadour
  GENRE_FILE="../data/genres.json"

  ```
  Do **NOT** add this file to source control. It is already in the `.gitignore`.

7. Run the server:

  In Development mode:
  ```bash
  npm run start-dev
  ```

  Build for production and run:
  ```bash
  npm run build && npm run start
  ```
