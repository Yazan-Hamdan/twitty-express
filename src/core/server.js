import express from 'express'
import cors from 'cors'
import http from 'http'
import { express as express_config } from '@config'
import helmet from 'helmet'

const app = express()

app.use(helmet()); // used for security
app.use(cors())
app.set('view engine', 'html'),
    app.engine('html', express_config.renderEngine)

app.use(express.json({ limit: '10mb', extended: true }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const server = http.createServer(app)

export {
    app,
    server
}