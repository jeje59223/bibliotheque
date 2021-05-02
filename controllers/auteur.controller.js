auteurModel = require("../models/auteurs.modele");
const mongoose = require("mongoose");
const fs = require("fs");
const livreModel = require("../models/livres.modele");

 // permet d'afficher un auteur
exports.auteur_affichage = (requete, reponse) => {
    auteurModel.findById(requete.params.id)
    .populate("livres")
    .exec()
    .then(auteur => {
        console.log(auteur);
        reponse.render("auteurs/auteur.html.twig", {auteur : auteur, isModification:false});
    })
    .catch(error => {
        console.log(error);
    })    
}

 // permet d'afficher la liste d'auteurs
exports.auteurs_affichage = (requete, reponse) => {
    auteurModel.find()
    .populate("livres")
    .exec()
    .then(auteurs => {
        reponse.render("auteurs/liste.html.twig", {auteurs: auteurs});
    }) 
    .catch();   
}

// permet d'ajouter un auteur
exports.auteurs_ajout = (requete, reponse) => {
    const auteur = new auteurModel({
        _id : new mongoose.Types.ObjectId,
        nom: requete.body.nom,
        prenom: requete.body.prenom,
        age: requete.body.age,
        sexe: requete.body.sexe ? true : false
    })
    auteur.save()
    .then(resultat => {
        reponse.redirect("/auteurs");
    })
    .catch(error => {
        console.log(error);
    })
}

// permet de supprimer un auteur
exports.auteur_suppression = (requete, reponse) => {
    auteurModel.find() // on recupere l'auteur anonyme 1/2 on en recupere un tableau avec une valeur
    .where("nom").equals("anonyme") // 2/2
    .exec() // on execute la requete
    .then(auteur => {
        livreModel.updateMany({"auteur":requete.params.id}, {"$set":{"auteur": auteur[0]._id }}, {"multi":true}) // on met a jour tous les livres de l'auteur id et on les remplace par anonyme
        .exec()
        .then(
            auteurModel.remove({_id:requete.params.id})
            .where("nom").ne("anonyme") // empeche la suppression de l'auteur anonyme
            .exec()
            .then(reponse.redirect("/auteurs"))
            .catch()
        )
    })
}

// permet de modifier un auteur
exports.auteur_modification = (requete, reponse) => {
    auteurModel.findById(requete.params.id)
    .populate("livres")
    .exec()
    .then(auteur => {
        console.log(auteur);
        reponse.render("auteurs/auteur.html.twig", {auteur : auteur, isModification:true});
    })
    .catch(error => {
        console.log(error);
    })    
}

// permet de valider les modifications de l'auteur :
exports.auteur_modification_validation = (requete, reponse) => {
    const auteurUpdate = {
        nom: requete.body.nom,
        prenom: requete.body.prenom,
        age: requete.body.age,
        sexe: (requete.body.sexe) ? true : false,
    };
    auteurModel.update({_id:requete.body.identifiant}, auteurUpdate)
    .exec()
    .then( resultat => {
        reponse.redirect("/auteurs");
    })
    .catch();
}