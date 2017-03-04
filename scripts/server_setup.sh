docker pull redis
mkdir ~/redis_data
docker run -d -p 6379:6379 -v ~/redis_data:/data --name redis redis
