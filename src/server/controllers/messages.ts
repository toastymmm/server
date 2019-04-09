'use strict';

import util = require('util')
import swaggerTools = require('swagger-tools')
import db = require('../db')
import Message = db.Message
import MessageFeature = db.MessageFeature
import api = require('../api')
import turf = require('@turf/turf')
import mongodb = require('mongodb')

const inspect = (input: any) => util.inspect(input, false, Infinity, false)

// Make sure this matches the Swagger.json body parameter for the /signup API
interface MessagesPayload {
    lon: swaggerTools.SwaggerRequestParameter<number>,
    lat: swaggerTools.SwaggerRequestParameter<number>,
    [paramName: string]: swaggerTools.SwaggerRequestParameter<number> | undefined;
}

// Make sure this matches the Swagger.json body parameter for the /message GET API
interface GetMessagePayload {
    id: swaggerTools.SwaggerRequestParameter<string>,
    [paramName: string]: swaggerTools.SwaggerRequestParameter<string> | undefined;
}

// Make sure this matches the Swagger.json body parameter for the /message GET API
interface PatchMessagePayload {
    id: swaggerTools.SwaggerRequestParameter<string>,
    message: swaggerTools.SwaggerRequestParameter<Message>,
    [paramName: string]: swaggerTools.SwaggerRequestParameter<string>
        | swaggerTools.SwaggerRequestParameter<Message>
        | undefined;
}

// Make sure this matches the Swagger.json body parameter for the /message DELETE API
interface DeleteMessagePayload {
    id: swaggerTools.SwaggerRequestParameter<string>,
    [paramName: string]: swaggerTools.SwaggerRequestParameter<string> | undefined;
}

// Make sure this matches the Swagger.json body parameter for the /message POST API
interface PostMessagePayload {
    message: swaggerTools.SwaggerRequestParameter<MessageFeature>,
    [paramName: string]: swaggerTools.SwaggerRequestParameter<MessageFeature> | undefined;
}

interface MessagesUserIdPayload {
	userId: swaggerTools.SwaggerRequestParameter<string>,
	[paramName: string]: swaggerTools.SwaggerRequestParameter<string> | undefined;
}

module.exports.messages = function (req: api.Request & swaggerTools.Swagger20Request<MessagesPayload>, res: any, next: any) {

    console.log(util.inspect(req.swagger.params, false, Infinity, true))

    res.setHeader('Content-Type', 'application/json')

    if (!req.session) {
        res.status(api.InternalServerError)
        res.send(JSON.stringify({ message: inspect(new Error("No session object exists.")) }, null, 2))
        return res.end()
    }

    var rangeInMeters = 100
    const rangeInDegrees = turf.lengthToDegrees(rangeInMeters, "meters")

    //capture search in variable
    const lon = req.swagger.params.lon.value;
    const lat = req.swagger.params.lat.value;
    //if there is a search, match with database docs that belong to that user and put them in array.
    //returned items must belong to the user AND match what was searched in any field belonging to that doc
    db.messages.find({'feature.geometry': {$geoWithin: { $centerSphere: [ [ lon, lat ], rangeInDegrees ]}}}).toArray().then((data) => {
        if (data) {
            res.status(api.OK)
            res.send(JSON.stringify(data))
            res.end()
        }
        else {
            res.status(api.OK)
            res.send(JSON.stringify([], null, 2))
            res.end()
        }
    }).catch((err) => {
        res.status(api.InternalServerError)
        res.send(JSON.stringify({ message: inspect(err) }, null, 2))
        res.end()
    })
}

/* factor out messagesUserId/messagesMyUser functionality */
function grab_messages_by(userId : string, res : any) {
	db.messages.find({ "creator": new mongodb.ObjectID(userId) }).toArray().then((data) => {
		if (data) {
			res.status(api.OK)
			res.send(JSON.stringify(data))
			res.end()
		} else {
			res.status(api.OK)
			res.send(JSON.stringify([], null, 2))
			res.end()
		}
	}).catch((err) => {
		res.status(api.InternalServerError)
		res.send(JSON.stringify({ message: inspect(err) }, null, 2))
		res.end()
	})
}

module.exports.messagesUserId = function (req: api.Request & swaggerTools.Swagger20Request<MessagesUserIdPayload>, res: any, next: any) {
	console.log(util.inspect(req.swagger.params, false, Infinity, true))

	res.setHeader('Content-Type', 'application/json')

    if (!req.session) {
        res.status(api.InternalServerError)
        res.send(JSON.stringify({ message: inspect(new Error("No session object exists.")) }, null, 2))
        return res.end()
    }

	const userId = req.swagger.params.userId.value;

    if (req.session.userid != userId && !req.session.admin) {
        res.status(api.InternalServerError)
        res.send(JSON.stringify({ message: inspect(new Error("You must be logged in as the user for which you are requesting messages or an admin.")) }, null, 2))
        return res.end()
    }

	grab_messages_by(userId, res)
}

module.exports.messagesMyUser = function (req : api.Request, res: any, next: any) {
	res.setHeader('Content-Type', 'application/json')

	if (!req.session) {
		res.status(api.InternalServerError)
		res.send(JSON.stringify({ message: inspect(new Error("No session object exists.")) }, null, 2))
		return res.end()
	}

	grab_messages_by(req.session.userid, res)
}

module.exports.getMessage = function (req: api.Request & swaggerTools.Swagger20Request<GetMessagePayload>, res: any, next: any) {

    console.log(util.inspect(req.swagger.params, false, Infinity, true))

    res.setHeader('Content-Type', 'application/json')

    if (!req.session) {
        res.status(api.InternalServerError)
        res.send(JSON.stringify({ message: inspect(new Error("No session object exists.")) }, null, 2))
        return res.end()
    }

    const id = req.swagger.params.id.value;

    db.messages.findOne({'_id': new mongodb.ObjectID(id)}).then((data) => {
        if (data) {
            res.status(api.OK)
            res.send(JSON.stringify(data))
            res.end()
        }
        else {
            res.status(api.NotFound)
            res.send(JSON.stringify({ message: `Message does not exist for ${id}` }, null, 2))
            res.end()
        }
    }).catch((err) => {
        res.status(api.InternalServerError)
        res.send(JSON.stringify({ message: inspect(err) }, null, 2))
        res.end()
    })
}

module.exports.patchMessage = function (req: api.Request & swaggerTools.Swagger20Request<PatchMessagePayload>, res: any, next: any) {

    console.log(util.inspect(req.swagger.params, false, Infinity, true))

    res.setHeader('Content-Type', 'application/json')

    if (!req.session) {
        res.status(api.InternalServerError)
        res.send(JSON.stringify({ message: inspect(new Error("No session object exists.")) }, null, 2))
        return res.end()
    }

    const id = req.swagger.params.id.value;

    db.messages.findOne({'_id': new mongodb.ObjectID(id)}).then((data) => {
        if (data) {
            if (data.creator.equals(req.session.userid) || req.session.admin) {
                res.status(api.OK)
                res.send(JSON.stringify(data))
                return res.end()
            }
            else {
                res.status(api.Forbidden)
                res.send(JSON.stringify({ message: `Only admins or the creator can modify a message`}))
                return res.end()
            }
        }
        else {
            res.status(api.NotFound)
            res.send(JSON.stringify({ message: `Message does not exist for ${id}` }, null, 2))
            return res.end()
        }
    }).catch((err) => {
        res.status(api.InternalServerError)
        res.send(JSON.stringify({ message: inspect(err) }, null, 2))
        return res.end()
    })
}

module.exports.deleteMessage = function (req: api.Request & swaggerTools.Swagger20Request<DeleteMessagePayload>, res: any, next: any) {

    console.log(util.inspect(req.swagger.params, false, Infinity, true))

    res.setHeader('Content-Type', 'application/json')

    if (!req.session) {
        res.status(api.InternalServerError)
        res.send(JSON.stringify({ message: inspect(new Error("No session object exists.")) }, null, 2))
        return res.end()
    }

    // capture search in variable
	const id = req.swagger.params.id.value;

	db.messages.findOne({ "_id": new mongodb.ObjectID(id)}).then((msg) => {

		// see if we didn't find a message
		if (!msg) {
			res.status(api.InternalServerError)
			res.send(JSON.stringify({ message: inspect(new Error("Message not found")) }, null, 2))
			return res.end()
		}

		/* delete message if we own it or if we are admin */
		if (msg.creator.equals(req.session.userid) || req.session.admin) {
			db.messages.deleteOne( msg );

			res.status(api.OK)
			res.send(JSON.stringify([], null, 2))
			return res.end()
		} else {
			res.status(api.InternalServerError)
			res.send(JSON.stringify({ message: inspect(new Error("Message does not belong to user.")) }, null, 2))
			return res.end()
		}
	}).catch((err) => {
        res.status(api.InternalServerError)
        res.send(JSON.stringify({ message: inspect(err) }, null, 2))
        return res.end()
    })
}

module.exports.postMessage = function (req: api.Request & swaggerTools.Swagger20Request<PostMessagePayload>, res: any, next: any) {


    console.log(util.inspect(req.swagger.params, false, Infinity, true))

    res.setHeader('Content-Type', 'application/json')

    if (!req.session) {
        res.status(api.InternalServerError)
        res.send(JSON.stringify({ message: inspect(new Error("No session object exists.")) }, null, 2))
        return res.end()
    }

    if (!req.session.userid) {
        res.status(api.Forbidden)
        res.send(JSON.stringify({ message: inspect(new Error("You must be logged in to use post messages.")) }, null, 2))
        return res.end()
    }

    //message to insert into db
    const message = req.swagger.params.message.value;

    const newMessage = {
        feature: message.feature,
        creator: new mongodb.ObjectID(req.session.userid)
    }

    db.messages.insertOne(newMessage).then((result) => {
        if (result) {
            db.messages.findOne({'_id': new mongodb.ObjectID(result.insertedId)}).then((newObject) => {
                res.status(api.OK)
                res.send(JSON.stringify(newObject))
                return res.end()
            }).catch((err) => {
                res.status(api.InternalServerError)
                res.send(JSON.stringify({ message: inspect(err) }, null, 2))
                return res.end()
            })
        }
        else {
            res.status(api.InternalServerError)
            res.send(JSON.stringify(result))
            return res.end()
        }
    }).catch((err) => {
        res.status(api.InternalServerError)
        res.send(JSON.stringify({ message: inspect(err) }, null, 2))
        return res.end()
    })
}
