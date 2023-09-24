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


export const getByID = async id => {
    const body = {
        query: {
            terms: {
                _id: [id]
            }
        }
    }

    const query = {
        index: "tweets",
        body
    }

    return await search(query)
}


export const getInsights = async req => {
    const { lon, lat, radius, start_date, end_date, keyword } = req.body
    const res = await search(await buildTweetsQuery(lon, lat, radius, start_date, end_date, keyword, undefined, 10000))
    const hits = res.hits.hits

    const statistics = {
        hashtags: {},
        words: {},
        topics: {},
        domains: {},
        countryCode: {}
    }

    for await (const tweet of hits) {
        let text = tweet._source.text

        let countryCode = tweet._source.country_code
        await countElements(statistics, "countryCode", [countryCode])

        let domains = await extractURLs(tweet._source.entities.urls)
        await countElements(statistics, "domains", domains)

        let hashtags = await extractHashtags(tweet._source.entities.hashtags)
        await countElements(statistics, "hashtags", hashtags)

        let topics = await extractTopics(text)
        await countElements(statistics, "topics", topics)

        let words = await extractWords(text)
        await countElements(statistics, "words", words)
    }

    return { statistics, hits }
}