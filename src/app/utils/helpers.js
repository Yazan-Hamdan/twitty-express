import nlp from 'compromise'

const formatEnum = {
    'year': "yyyy",
    'month': "yyyy-MM",
    'day': "yyyy-MM-dd"
}

const extractHostname = async url => {
    let hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
}

export const extractURLs = async urls => {
    return urls.map(ele => extractHostname(ele.expanded_url))
}

export const extractHashtags = async hashtags => {
    return hashtags.map(ele => ele.text)
}

//first removes URLs, then removes hashtags, then removes all special characters, finally remove extra spaces
const filterTextFromSpecialCharacters = async text => {
    return text.replace(new RegExp("http\\S+", 'g'), "").replace(/#([^\\s]*)/g, '')
        .replace(/[^a-zA-Z ]/g, '').replace(/\s+/g, ' ').trim()
}

const removeShortWords = async text => {
    return text.toLowerCase().split(' ').filter(word => word.length > 2).join(' ')
}

export const extractTopics = async text => {
    const filteredText = await filterTextFromSpecialCharacters(text)
    let topics = nlp(filteredText).topics().json()
    return topics.map(ele => ele?.text).filter(ele => ele.length > 2)
}

export const extractWords = async text => {
    const filteredText = await filterTextFromSpecialCharacters(text)
    return await removeShortWords(filteredText)
}

const createGeoFilter = (lon, lat, radius) => ({
    geo_distance: {
        distance: `${radius}m`,
        geo: {
            lat,
            lon
        }
    }
});

const createDateRangeFilter = (start_date, end_date) => ({
    range: {
        created_at: {
            gte: start_date,
            lt: end_date
        }
    }
});

const createKeywordFilter = keyword =>
    keyword?.length
        ? {
              term: {
                  text: keyword
              }
          }
        : null;

const createTimeAggregation = time_interval =>
    time_interval?.length
        ? {
              aggs: {
                  counter: {
                      date_histogram: {
                          field: "created_at",
                          calendar_interval: time_interval,
                          format: formatEnum[time_interval]
                      }
                  }
              }
          }
        : null;

export const buildTweetsQuery = (lon, lat, radius, start_date, end_date, keyword, time_interval, size = 100) => {
    const filters = [
        createGeoFilter(lon, lat, radius),
        createDateRangeFilter(start_date, end_date),
    ];

    const keywordFilter = createKeywordFilter(keyword);
    if (keywordFilter) {
        filters.push(keywordFilter);
    }

    const aggregation = createTimeAggregation(time_interval);

    const query = {
        size,
        query: {
            bool: {
                filter: filters
            }
        },
        ...(aggregation || {})
    };

    return {
        index: "tweets",
        body: query
    };
};


export const countElements = async (statistics, mainKey, elements) => {
    if (!Array.isArray(elements)) {
        elements = elements.split(' ')
    }

    for await (const ele of elements) {
        if (ele) { //sometimes the ele is empty string which we will ignore
            if (statistics[mainKey][ele])
                statistics[mainKey][ele] += 1
            else
                statistics[mainKey][ele] = 1
        }
    }
}