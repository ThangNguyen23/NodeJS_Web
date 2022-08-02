import mongoose from "mongoose";
import User from "../models/User.js";
import bcrypt from "bcryptjs"
import {createError} from "../error.js";
import handler from "../handler.js"
import jwt from "jsonwebtoken"

export const signup = async (req, res) => {
    try {
        const user = await User.findOne({name: req.body.name})
        if (!user) {
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(req.body.password, salt)
            const newUser = new User({...req.body, password: hash})
            try {
                const savedUser = await newUser.save()

                const token = jwt.sign({id: savedUser._id}, process.env.JWT)
                return res.cookie('access_token', token, {
                    httpOnly: true
                }).status(200).json(savedUser)
            }
            catch (err) {
                return handler(err, req, res, createError(404, 'not found sorry'))
            }
        }
        else {
            return res.status(200).send('user has been created')
        }
    }
    catch (err) {
        return handler(err, req, res, createError(404, 'not found sorry'))
    }
}

export const signin = async (req, res) => {
    try {
        const user = await User.findOne({name: req.body.name})
        if (!user) {
            return handler('', req, res, createError(404, 'user not found'))
        }

        // compare 2 passwords
        const isCorrect = await bcrypt.compare(req.body.password, user.password)

        if (!isCorrect) {
            return handler('', req, res, createError(400, 'wrong credentials'))
        }

        const token = jwt.sign({id: user._id}, process.env.JWT)
        const {password, ...others} = user._doc // get only document in data

        return res.cookie('access_token', token, {
            httpOnly: true
        }).status(200).json(others)
    }
    catch (err) {
        return handler(err, req, res, createError(404, 'not found sorry'))
    }
}

export const googleAuth = async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email})
        if (user) {
            const token = jwt.sign({id: user._id}, process.env.JWT)
            return res.cookie('access_token', token, {
                httpOnly: true
            }).status(200).json(user._doc)
        }
        else {
            // create a new user when it is the first time user sign in
            const newUser = new User({...req.body, fromGoogle: true})
            const savedUser = await newUser.save()

            const token = jwt.sign({id: savedUser._id}, process.env.JWT)
            return res.cookie('access_token', token, {
                httpOnly: true
            }).status(200).json(savedUser._doc)
        }
    }
    catch (err) {
        return next(err)
    }
}