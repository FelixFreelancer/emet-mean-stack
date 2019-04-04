# Building RESTful Web APIs with Node.js, Express, MongoDB and TypeScript for Emet Website

This is a EMET-Mean API that will be used in Emet Website.

## Requirements

[NodeJS](https://nodejs.org/en/)

You should install TypeScript to run this project.
Install global TypeScript and TypeScript Node

```
npm install -g typescript ts-node
```

## Getting Started

You should install [MongoDB](https://docs.mongodb.com/manual/administration/install-community/) on your local machine, or use other services such as [mLab](https://mlab.com/) or [Compose](https://www.compose.com/compare/mongodb)

After that, you will have to replace the mongoURL with your MongoDB address in *lib/app.ts*

## Clone this repository

```
git clone https://gitlab.com/emet-group/emet-mean.git .
```

Then install the dependencies

```
npm install
```

## Start the server

Run in development mode

```
npm run dev
```

Run in production mode 

```
npm run prod
```

## Testing 

The default URL is: *http://localhost:3000*

+ GET all contacts

```
Send GET request to http://localhost:3000/api/
```

Please contact with Emethorizen for further details.