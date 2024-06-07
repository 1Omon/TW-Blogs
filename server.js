import express from 'express';
import { connect } from 'mongoose';
import dotenv from "dotenv"
import fs from "fs";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import helmet from 'helmet';
import bodyParser from 'body-parser';
// import user__route from "./user/route.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const server = express();

var accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    {flags: 'a'}
);

server.use(express.json());
server.use(helmet());
server.use(
    helmet.crossOriginResourcePolicy(
        {
            policy: "cross-origin"
        }
    )
);
server.use(cors(
    {
        origin: ['*'],
        credentials: true
    }
))
server.use(
    morgan(
        'combined',
        { stream: accessLogStream }
    )
);

server.use(
    bodyParser.json(
        {
            limit: '30mb',
            extended: true
        }
    )
);

server.use(
    bodyParser.urlencoded(
        {
            limit: "30mb",
            extended: true
        }
    )
);

server.use(
    "/assets",
    express.static(
        path.join(
            __dirname,
            "public/assets"
        )
    )
);

const storage = multer.diskStorage(
    {
        destination: function (req, file, cb) {
            cb(null, "public/assets");
        },
        filename: function(req, file, cb){
            cb(null, file.originalname)
        }
    }
);

const upload = multer(
    { storage }
);

server.use((err, req, res, next) => {
    console.err('Server Error', err);
    res.status(500).json(
        {
            message: 'Internal server error'
        }
    )
});

// server.use('/user', user__route);

server.all("*", (req, res) => {
    res.status(404).json({
        message: "page not found"
    })
})

connect(process.env.database_url)
.then (
    () => server.listen(
        process.env.port, 
        () => {console.log('Successfully connected to database')}
    )
)
.catch(error => console.error(error))