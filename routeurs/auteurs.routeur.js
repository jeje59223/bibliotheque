var express = require("express");
var routeur = express.Router();
const twig = require("twig");

const auteurController = require("../controllers/auteur.controller");

routeur.get("/:id", auteurController.auteur_affichage);
routeur.get("/", auteurController.auteurs_affichage);
routeur.post("/", auteurController.auteurs_ajout);
routeur.post("/delete/:id", auteurController.auteur_suppression);
routeur.get("/modification/:id", auteurController.auteur_modification);
routeur.post("/modificationServer", auteurController.auteur_modification_validation);

module.exports = routeur;