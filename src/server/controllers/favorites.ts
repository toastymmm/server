'use strict';

import util = require('util')
import swaggerTools = require('swagger-tools')
import db = require('../db')
import Favorite = db.Favorite
import api = require('../api')
import mongodb = require('mongodb')

const inspect = (input: any) => util.inspect(input, false, Infinity, false)

// Make sure this matches the Swagger.json body parameter for the /favorites GET API
interface FavoritesPayload {
    userId: swaggerTools.SwaggerRequestParameter<string>,
    [paramName: string]: swaggerTools.SwaggerRequestParameter<string> | undefined;
}

interface FavoritesMePayload {
	[paramName: string]: swaggerTools.SwaggerRequestParameter<string> | undefined;
}

interface PostFavoritePayload {
    id: swaggerTools.SwaggerRequestParameter<string>,
    [paramName: string]: swaggerTools.SwaggerRequestParameter<string> | undefined;
}

interface DeleteFavoritePayload {
    id: swaggerTools.SwaggerRequestParameter<string>,
    [paramName: string]: swaggerTools.SwaggerRequestParameter<string> | undefined;
}

function grab_favorites_by(user_id : string, res : any) {
	db.favorites.find({ "userId": new mongodb.ObjectID(user_id) }).toArray().then((data) => {
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

module.exports.getFavorites = function (req: api.Request & swaggerTools.Swagger20Request<FavoritesPayload>, res: any, next: any) {

    console.log(util.inspect(req.swagger.params, false, Infinity, true))

    res.setHeader('Content-Type', 'application/json')

    if (!req.session) {
        res.status(api.InternalServerError)
        res.send(JSON.stringify({ message: inspect(new Error("No session object exists.")) }, null, 2))
        return res.end()
    }

    //capture search in variable
    const id = req.swagger.params.userId.value;
	grab_favorites_by(id, res)
}

module.exports.getFavoritesMe = function (req: api.Request & swaggerTools.Swagger20Request<FavoritesMePayload>, res: any, next: any) {

	console.log(util.inspect(req.swagger.params, false, Infinity, true))

	res.setHeader('Content-Type', 'application/json')

	if (!req.session || !req.session.userid) {
		res.status(api.InternalServerError)
		res.send(JSON.stringify({ message: inspect(new Error("No session object exists.")) }, null, 2))
		return res.end()
	}

	grab_favorites_by(req.session.userid, res)
}

module.exports.postFavorite = function (req: api.Request & swaggerTools.Swagger20Request<PostFavoritePayload>, res: any, next: any) {

    console.log(util.inspect(req.swagger.params, false, Infinity, true))

    res.setHeader('Content-Type', 'application/json')

	if (!req.session || !req.session.userid) {
        res.status(api.InternalServerError)
        res.send(JSON.stringify({ message: inspect(new Error("No session object exists.")) }, null, 2))
        return res.end()
	}

	const message_id = new mongodb.ObjectID(req.swagger.params.id.value)
	const user_id = new mongodb.ObjectID(req.session.userid)

	const new_favorite = {
		_id: new mongodb.ObjectID(),
		messageId : message_id,
		userId: user_id
	}

	db.favorites.findOne({messageId : message_id, userId: user_id}).then((fav) => {
		if (!fav) {
			db.favorites.insertOne(new_favorite).then((success) => {
				if (success) {
					res.status(api.OK)
					res.send(JSON.stringify({ message: "made new fav", new_favorite}))
					return res.end()
				} else {
					res.status(api.InternalServerError)
					res.send(JSON.stringify({ message: "idk"}))
					return res.end()
				}
			}).catch((err) => {
				res.status(api.InternalServerError)
				res.send(JSON.stringify({ message: inspect(err) }, null, 2))
				return res.end()
			})
		} else {
			res.status(api.OK)
			res.send(JSON.stringify({message: "was already fav'd", fav}))
			return res.end()
		}
	}).catch((err) => {
		res.status(api.InternalServerError)
		res.send(JSON.stringify({ message: inspect(err) }, null, 2))
		return res.end()
	})
}

module.exports.deleteFavorite = function (req: api.Request & swaggerTools.Swagger20Request<DeleteFavoritePayload>, res: any, next: any) {

    console.log(util.inspect(req.swagger.params, false, Infinity, true))

    res.setHeader('Content-Type', 'application/json')

	if (!req.session || !req.session.userid) {
        res.status(api.InternalServerError)
        res.send(JSON.stringify({ message: inspect(new Error("No session object exists.")) }, null, 2))
        return res.end()
    }

    // capture search in variable
	const id = req.swagger.params.id.value;

	db.favorites.findOne({ "_id": new mongodb.ObjectID(id)}).then((fav) => {

		// see if we didn't find a message
		if (!fav) {
			res.status(api.InternalServerError)
			res.send(JSON.stringify({ message: inspect(new Error("Favorite not found")) }, null, 2))
			return res.end()
		}

		if (!req.session.admin && !fav.userId.equals(req.session.userid)) {
			res.status(api.Forbidden)
			res.send(JSON.stringify({ message : "you can't delete someone else's fav"}))
			return res.end()
		}

        db.favorites.deleteOne( fav );
        res.status(api.OK)
        res.send(JSON.stringify({ message: "favorite successfully deleted"}, null, 2))
        return res.end()

	}).catch((err) => {
        res.status(api.InternalServerError)
        res.send(JSON.stringify({ message: inspect(err) }, null, 2))
        return res.end()
    })
}
