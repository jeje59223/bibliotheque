const express = require("express"); // E1 récupérer le module express
const server = express(); // E2 créer le serveur express
const morgan = require("morgan"); // on recupere le module morgan
const routeurLivre = require("./routeurs/livres.routeur"); // recupere livres.routeur.js
const routeurGlobal = require("./routeurs/global.routeur"); // recupere global.routeur.js
const routeurAuteur = require("./routeurs/auteurs.routeur"); // recupere auteurs.routeur.js
const mongoose = require("mongoose"); // on recupere mongoose
const bodyParser = require("body-parser"); // on recupere body-parser
const session = require("express-session");

mongoose.connect("mongodb://localhost/biblio2", {useNewUrlParser:true, useUnifiedTopology:true});



server.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge: 60000}
}))

server.use(express.static("public"));
server.use(morgan("dev"));
server.use(bodyParser.urlencoded({extended:false}));
server.set('trust proxy', 1)

server.use((requete, reponse, suite) => {
    reponse.locals.message = requete.session.message;
    delete requete.session.message;
    suite();
})

server.use("/livres/", routeurLivre);
server.use("/auteurs/", routeurAuteur); // faire attention a l'ordre

server.use("/", routeurGlobal);


server.listen(8000); // E3 indiquer sur quel PORT le serveur écoute

