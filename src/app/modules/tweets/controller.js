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

export const getByID = async (req, res) => {
    try {
        const { id } = req.params
        res.send(await tweetsServices.getByID(id))
    }
    catch (e) {
        if (e.type === 'notFound') {
            return new ErrorWrapper(e.message).notFound(res)
        }
        return new ErrorWrapper(e.message).internalServerError(res)
    }
}

export const getInsights = async (req, res) => {
    try {
        res.send(await tweetsServices.getInsights(req))
    }
    catch (e) {
        if (e.type === 'notFound') {
            return new ErrorWrapper(e.message).notFound(res)
        }
        return new ErrorWrapper(e.message).internalServerError(res)
    }
}