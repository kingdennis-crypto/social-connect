# PostgreSQL Docker Environment Variables

This `.env` file contains the environment variables required for setting up a PostgreSQL database container using Docker Compose.

## Usage

1. Make sure you have Docker and Docker Compose installed on your system.

2. Create a file named `.env` in the same directory as your `docker-compose.yml` file.

3. Copy the content below into the `.env` file:

```plaintext
# DOCKER
POSTGRES_DB='mydatabase'
POSTGRES_USER='myuser'
POSTGRES_PASSWORD='mypassword'
