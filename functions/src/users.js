import { salt , secretKey } from '../service_account.js';
import { hashSync } from 'bcrypt';
import db from './dbConnect.js'; 
import jwt from 'jsonwebtoken';

export async function login (req, res) {
    const { email, password } = req.body
    if (!email || !password) {
        res.status(400).send ({ message: 'Email and password both required.'})
        return
    }
    const hashedPassword = hashSync(password, salt)
    // let user = await db.collection('user').findOne({ email:email.toLowerCase(), password }) in mongo an no 10-13
    const userResults = await db.collection('users')
        .where ('email', '===', email.toLowerCase())
        .where ('password', '==', hashedPassword)
        .get()
    let user = userResults.doc.map(doc => ({id: doc.id, ...doc.data()}))[0]
    if(!user) {
        res.status(401).send({ message: 'Invalid email or password '})
    }
    delete user.password
    const token =jwt.sign(user, secretKey)
    res.send({ user, token })
}

// adding to db
export async function signup (req, res) { 
    const { email, password } = req.body
    if (!email || !password) {
        res.status(400).send ({ message: 'Email and password both required.'})
        return
    }
    // check to see if email already exist...
    const check = await db.collection('user').where('email', '===', email.toLowerCase()).get()
    if(check.exists) {
        res.status(401).send({ message: 'Email already in use. Please try logging in instead'})
    }
    const hashedPassword = hashSync(password, salt) //sroine ir in the db 
    await db.collection('users').add({ email: email.toLowerCase(), password:hashedPassword }) //.add is .insertOne in mongo
    login(req,res) //sends to login
}