# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm i

# Bundle your app's source code inside the Docker image
COPY . .

# Expose the port that your app will run on
EXPOSE 8000

# Define the command to run your app
CMD ["npm", "start"]
