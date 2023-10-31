import { pool } from "../../db.js";
import jwt from "jsonwebtoken";

export const login = async (req, res) =>{
    try {
        console.log(req.body)
        const {Nombre_usuario, Identificacion} = req.body;
        const [result] = await pool.query( 'SELECT * FROM usuarios WHERE Nombre_usuario=? AND Identificacion=?',[Nombre_usuario, Identificacion],(error)=>{
            if (error) {
                res.status(500).json({error: 'Error de servidor'})
                console.error(error)
            }
        })
        if (result.length > 0) {
            const token_payload = {
                Id: result[0].Id,
                Nombre: result[0].Nombre,
                Nombre_usuario: Nombre_usuario,
                Identificacion: Identificacion
            }
            const token = jwt.sign(token_payload, 'SecretKey', {expiresIn:'100s'})
            console.log(token)
            res.cookie('jwt',token, {httpOnly: true, maxAge: 30000})
            res.status(200).json({message: 'Inicio de sesion exitoso'})
        } else {
            res.status(401).json({error: 'Valores invalidos'})
        }
    } catch (error) {
        res.status(500).json({message: 'Ha ocurrido un error'})
    }
    
}

export const protegida =  (req, res) => {
    const token = req.cookies.jwt
    console.log(token)
    if (!token) {
        res.status(401).json({error: 'Acceso no posible'})
    } else{
        jwt.verify(token, 'SecretKey', (error, decoded)=>{
            if (error) {
                res.status(401).json({error: 'Acceso denegado'})
            } else {
                res.status(200).json({message: 'Acceso autorizado a la ruta protegida'})
            }
        })
    }
}