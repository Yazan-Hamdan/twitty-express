# Twitty Application

## Description

This repository is a dockorized Nodejs app using a bunch of common packages and best practices in a modular architecture.

### Packages:
  - Expressjs (a common routing framework)
  - babel-node (for running modern javascript code)

## Usage

### Installing

In order to use this boilerplate, you will need to clone this repository, have docker and docker-compose 1.75 installed, and run the following:
  - `docker-compose up --build`
  - `docker-compose up`

The application should be running now, congrats!
### Folder structure

Here's a folder structure for the project:

```
project-folder/        # Root directory.
|- src/                # the source directory
|-- app/               # the app's main directory
|--- modules/          # routes, controllers, services, tests, ...etc
|-- config/            # the config files of the application
|-- core/              # the core functionality files
|-- index.js           # the application entrypoit
|- .babelrc            # babeljs configurations file
|- .dockerignore       # the files/directories that should be ignored by docker
|- .env.example        # an example file of the env variable that can be set in this project
|- .eslintrc.js        # the eslint configuration file
|- docker-compose.yml  # the docker-compose file that will run the dev commands
|- Dockerfile          # the dockerfile that will build the Nodejs's container in production
|- package-lock.json   # the locked npm packages versions 
|- package.json        # the Nodejs's packages and commands file
|- README.md           # this document
```

### Modules Directory

this directory contains your modules files:

```
|- module_example/ # a directory that will contain your first module
|-- controller.js  # the controller of your module
|-- routes.js      # the routes of your module
|-- service.js     # the file that links this module to other modules
|-- ...
|- ...
|- index.js        # all modules routes must be registered in this file
```

#### Users module example

routes.js
```js
import { getFilteredData } from "./controller"  
import { router } from '@core/router'

const route = router()

route.post('/', getFilteredData)

export default route
```

controller.js
```js
import * as tweetsServices from './service'
import ErrorWrapper from '@app/utils/errorWrapper'

export const getFilteredData = async (req, res) => {
    try {
        res.send(await tweetsServices.getAllFilteredTweets(req))
    }
    catch (e) {
        if (e.type === 'notFound') {
            return new ErrorWrapper(e.message).notFound(res)
        }
        return new ErrorWrapper(e.message).internalServerError(res)
    }
}
}
```

service.js
```js
import { search } from "@app/utils/elasticUtils"
import { buildTweetsQuery, extractWords, extractTopics, extractHashtags, extractURLs, countElements } from "@app/utils/helpers"

export const getAllFilteredTweets = async req => {
    const { lon, lat, radius, start_date, end_date, keyword, time_interval } = req.body
    const res = await search(await buildTweetsQuery(lon, lat, radius, start_date, end_date, keyword, time_interval))
    const { aggregations } = res

    const hits = res.hits.hits.map(obj => {
        return {
            id: obj._id,
            user: obj._source.user,
            geo: obj._source.geo
        }
    })

    return { hits, aggregations }
}
```

### General Notes

- it's recommended to use `vscode` as your main code editor

- It's recommended to install `eslint` extension to your `vscode`

