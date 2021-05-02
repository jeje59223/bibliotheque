var express = require("express");
var routeur = express.Router();
const twig = require("twig");

// Afficher la page d'accueil
routeur.get("/", (requete, reponse) => {    
    reponse.render("accueil.html.twig");
})

routeur.use((requete, reponse, suite) =>{
    const error = new Error("Page non trouvée");
    error.status = 404;
    suite(error);
})

routeur.use((error, requete, reponse) => {
    reponse.status(error.status || 500);
    reponse.end(error.message);
})

module.exports = routeur;