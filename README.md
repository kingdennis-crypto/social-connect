# Social Connect

## Description

Social Connect is a powerful but flexible tool designed to use in my own projects. This API provides essential features for building a social media platform or enhancing existing projects with social networking capabilities. With token-based authentication, access and error logging, and media upload functionalities, it empowers the user to create and manage their social media experience.

## Features

- Token based authentication
- Access and error logging
- Media upload

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed
- Docker and Docker Compose installed

## Installation

To setup this project, follow these steps:

1. Install dependencies:

   ```bash
   npm install
   ```

1. Create a `.env` file in the root directory with the following configurations (replace the placeholders with actual values):

   ```bash
   # DOCKER
   POSTGRES_HOST=[HOST]
   POSTGRES_PORT=[PORT]
   POSTGRES_DB=[DATABASE NAME]
   POSTGRES_USER=[USER]
   POSTGRES_PASSWORD=[PASSWORD]
   
   # EXPRESS
   PORT=[PORT]
   ```

1. Build the Docker containers:

   ```bash
   docker-compose build
   ```

1. Start the application

   ```bash
   npm install
   ```
