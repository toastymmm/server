import express = require('express')
import mongodb = require('mongodb')

namespace Api {

    export interface Request extends express.Request {
        session: Session
    }

    export interface Session {
        username: string,
		userid: string,
		admin: boolean
    }

    export const OK = 200
    export const BadRequest = 400
    export const Forbidden = 403
    export const NotFound = 404
    export const InternalServerError = 500
}

export = Api
