FROM node:7.10.0

# Install essential tools
RUN apt-get -qq update && \
    apt-get -qq install sudo && \
    apt-get -qq install apt-transport-https && \
    apt-get -qq install build-essential && \
    apt-get -qq install git

# install yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && apt-get -qq install -y yarn

# Create app directory
RUN mkdir -p /usr/src/app

# Install app dependencies
COPY js/notificationService/package.json /usr/src/app

# Bundle app source
COPY js/notificationService/ /usr/src/app/notificationService/
COPY js/common/ /usr/src/app/common/

WORKDIR /usr/src/app/notificationService
RUN yarn install

# this will ultimately be a seperate package; for the time being, make sure all deps are installed
WORKDIR /usr/src/app/common
RUN yarn install

WORKDIR /usr/src/app/notificationService

CMD ["yarn", "start"]
