import express from "express"
import mongoose from "mongoose"
import user__route from './user/route'
import bodyParser from "body-parser"

const server = express()

app.use('/user', user__route)

mongoose.connect()