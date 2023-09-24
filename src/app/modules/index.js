import { app } from '@core/server'
import tweets from './tweets/routes'

export default [
    app.use('/api/v1/tweets', tweets)
]
