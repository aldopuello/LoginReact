import express from "express";
import { pool } from "./db.js";
import { login, protegida } from "./src/controllers/controller_login.js";
import cookieParser from "cookie-parser";

const app = express()
const port = 3000

app.use(express.json())
app.use(cookieParser())

const lista = async (req, res)=>{
    const [result] = await pool.query('SELECT * FROM usuarios')
    res.json(result)
}

app.get('/api', lista)

app.post('/login', login)

app.get('/protected', protegida)

app.listen(port)
console.log('Corriendo en el puerto '+ port)