# Troubadour Server

This is the back-end server for the troubadour project. For now, this repo only contains the node server, but eventually it should contain everything needed to run the backend including help for setting up the relevant dependent services.

## Dependencies
- Redis
- Postgres w/ PostGIS (Not used yet)
- Docker (**Note:** As of now, the app is set up so that you can run it without running the dependencies in a container. This may change.)
- A Spotify Client ID and Secret


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
4. Next create a file named `.env` on the same level as the `package.json`. Put the following the file.
```bash
SPOTIFY_CLIENT=<Spotify Client ID>
SPOTIFY_SECRET=<Spotify Client Secret>
REDIS_HOST=localhost
```
Do **NOT** add this file to source control. It is already in the `.gitignore`.
5. Run the server:

  In Development mode:
  ```bash
  npm run start-dev
  ```

  Build for production and run:
  ```bash
  npm run build && npm run start
  ```
