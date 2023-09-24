import {
    BAD_REQUEST,
    INTERNAL_SERVER_ERROR,
    NOT_FOUND,
    CONFLICT,
    NOT_ACCEPTED
  } from "@app/utils/httpConstants"
  
export default class ErrorWrapper {
    constructor(message, error="") {
        this.message = message
        this.error = error ? error : message
        this.code = INTERNAL_SERVER_ERROR
    }

    notFound(res) {
        this.code = NOT_FOUND
        this.send(res)
    }
    
    notAccepted(res) {
        this.code = NOT_ACCEPTED
        this.send(res)
    }

    internalServerError(res) {
        this.code = INTERNAL_SERVER_ERROR

        if (this.message.indexOf("E11000") > -1) {
            this.code = CONFLICT
        }
        this.send(res)
    }

    conflict(res) {
        this.code = CONFLICT
        this.send(res)
    }
    
    badRequest(res) {
        this.code = BAD_REQUEST
        this.send(res)
    }


    send(res) {
        let returnedMsg = {
            status: this.code,
            message: this.message,
            error: this.error
            }
        if (res && !res.headersSent){
            res.status(this.code)
            res.json(returnedMsg)
        }
    }
}