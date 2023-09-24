import config from '@config/elasticSearch'
import { Client } from '@elastic/elasticsearch'

const client = new Client({
    cloud: {
            id: config.id
    },
    auth: {
        username: config.username,
        password: config.password
    },
    
     node: config.host,
    requestTimeout: 60000
    })

export default client