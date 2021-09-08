const express = require("express")
const jwt = require("jsonwebtoken")
const { CLIENT_RENEG_WINDOW } = require("tls")

const app = express()
app.get("/api", (req, res) => {
    res.json({
        mensaje: "Nodejs and JWT"
    })
})

app.post("/api/login", (req, res) => {
    const user = {
        id: 1,
        nombre: "Juslan",
        email: "juslan@gmail.com"
    }

    jwt.sign({user}, 'secretkey', {expiresIn: '32s'}, (err, token) => {
        res.json({
            token
        });
    });
})// la cadena puede ser cualquier texto con el que hara el cifrado
app.post("/api/posts", verifyToken, (req, res) => {
    
    jwt.verify(req.token, 'secretkey', (error, authData)=>{
        if(error){
            res.status(403)
        }else{
                res.json({
                    mensaje: "Post fue creado",
                    authData: authData
                })
        }
    })
})

// Authorization: Bearer <token>
function verifyToken(req, res, next){
    const bearerHeader = req.headers['authorization'];

    if(typeof bearerHeader !== 'undefined' ){
        const  bearerToken = bearerHeader.split(" ")[1]
        req.token = bearerToken;
        next();
    }
    else{
        res.sendStatus(403);//acceso prohibido
    }
}

app.listen(4000, function(){
    console.log("nodejs app running---")
})