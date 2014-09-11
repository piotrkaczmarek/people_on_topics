People on Topics [WIP]
========================
http://peopleontopics.herokuapp.com/

Showcase demo of scalable realtime application.
## Overview
People on Topics is a chat app without the concept of chatrooms. Instead it lets users choose the only two important things when it comes to chatting with strangers:

- the people who you talk with
- the topics you talk about.

## Features
- Private chat messages
- Matching people that want to talk on the same topics

## Development features
- Covered with tests (conforming to [F.I.R.S.T. principles](http://agileinaflash.blogspot.de/2009/02/first.html)):
  - Unit tests for server logic: jasmine
  - Unit tests for client logic: karma + jasmine
  - E2E tests: protractor + jasmine
- Modularity following [Single Responsibility Principle and Dependency Injection pattern](http://en.wikipedia.org/wiki/SOLID_(object-oriented_design))
- Horizontal scalability:
  - Each node server opens socket connection with its clients independently - server instances are coordinated by Redis pub-sub mechanism.
  - Elasticsearch (replacing Redis from earlier commits) as persistence layer
  - [Token based authentication](https://auth0.com/blog/2014/01/15/auth-with-socket-io/)
- Multiclient potential
  - multiplatform socket.io library
  - JSON responses


## Installation
````
  npm install
````

````
  ./node_modules/protractor-multi/bin/webdriver-manager update
````

Set environment variable TOKEN_SECRET to long random html-secure string.


##### elasticsearch (ubuntu):
  - https://gist.github.com/wingdspur/2026107

## Running
````
  npm run es
````

````
  npm start
````
