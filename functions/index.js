import functions from 'firebase-functions';
import express from 'express';
import cors from 'cors'; 
import { login, signup } from  './src/users.js'
import { validToken, isAdmin } from './src/middleware.js';

const app = express()
app.use(cors({
    origin: [  //allows only the following websites to hit your api; only these website or urls to talk to this API
        'http://localhost',
        'https://bocacode.com'
    ]
})) // allow any website of url to talk to this API, when we don't put instructions within the (), saying app.use___ something for routes 

//let's set up our un-portected routes 

app.post('/login', login)
app.post('/signup', signup)

// now we set up protected routes
app.get('/secretinfo', validToken, (req,res) => res.send({ message: 'You made it!'}))
app.get('/supersecretinfo', validToken, isAdmin, (req,res) => res.send({ message: 'You made it here, too!'}))
// ...

app.listen(3030, () => (`Listening on port 3030...`)) // for testing

export const api = functions.https.onRequest(app) //for deploying