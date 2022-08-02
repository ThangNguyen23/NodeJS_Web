import {createError} from "../error.js";
import handler from "../handler.js"
import User from "../models/User.js"
import Video from "../models/Video.js";

export const update = async (req, res, next) => {
    if (req.params.id === req.user.id) {
        try {
            const updateUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, {new: true}) // option new to return user has been updated
            return res.status(200).json(updateUser)
        }
        catch (err) {
            return next(err)
        }
    }
    else {
        return handler('', req, res, createError(403, 'you just can update only your account'))
    }
}

export const deleteUser = async (req, res, next) => {
    if (req.params.id === req.user.id) {
        try {
            await User.findByIdAndDelete(req.params.id)
            return res.status(200).json('user has been deleted')
        }
        catch (err) {
            return next(err)
        }
    }
    else {
        return handler('', req, res, createError(403, 'you just can delete only your account'))
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
        return res.status(200).json(user)
    }
    catch (err) {
        return next(err)
    }
}

export const subscribe = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {
            $push: {subscribedUsers: req.params.id}, // id of channel which subscribed
        })
        await User.findByIdAndUpdate(req.params.id, {
            $inc: {subscribers: 1},
        })
        return res.status(200).json('subscription successful')
    }
    catch (err) {
        return next(err)
    }
}

export const unsubscribe = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {
            $pull: {subscribedUsers: req.params.id}, // id of channel which unsubscribed
        })
        await User.findByIdAndUpdate(req.params.id, {
            $inc: {subscribers: -1},
        })
        return res.status(200).json('unsubscription successful')
    }
    catch (err) {
        return next(err)
    }
}

export const like = async (req, res, next) => {
    const id = req.user.id
    const videoId = req.params.videoId
    try {
        await Video.findByIdAndUpdate(videoId, {
            $addToSet: {likes: id}, // do not use $push method because it caused duplicate user id
            $pull: {dislikes: id}
        })
        return res.status(200).json('the video has been liked')
    }
    catch (err) {
        return next(err)
    }
}

export const dislike = async (req, res, next) => {
    const id = req.user.id
    const videoId = req.params.videoId
    try {
        await Video.findByIdAndUpdate(videoId, {
            $addToSet: {dislikes: id}, // do not use $push method because it caused duplicate user id
            $pull: {likes: id}
        })
        return res.status(200).json('the video has been disliked')
    }
    catch (err) {
        return next(err)
    }
}
