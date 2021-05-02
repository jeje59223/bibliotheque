const livreModel = require("../models/livres.modele");
const AuteurModel = require("../models/auteurs.modele");
const mongoose = require("mongoose");
const fs = require("fs");

// fonction pour l'affichage des livre (liste)
exports.livres_affichage = (requete, reponse) => { 
    AuteurModel.find()
    .exec()
    .then(auteurs => {
        livreModel.find()
        .populate("auteur")
        .exec()
        .then(livres => {
            reponse.render("livres/liste.html.twig", {
                livres : livres, 
                auteurs : auteurs, 
                message: reponse.locals.message
            })
        })
        .catch(error => {
            console.log(error);
        });
    })
    .catch(error => {
        console.log(error);
    });
}

// fonction pour l'ajout d'un livre
exports.livres_ajout = (requete, reponse) => {
    const livre = new livreModel({
        _id: new mongoose.Types.ObjectId(),
        nom: requete.body.titre,
        auteur: requete.body.auteur,
        pages: requete.body.pages,
        description: requete.body.description,
        image: requete.file.path.substring(14)
    })
    livre.save()
    .then(resultat => {
        console.log(resultat);
        reponse.redirect("/livres")
    })
    .catch(error => {
        console.log(error);
    })
}

// fonction pour affichage d'un livre détaillé
exports.livre_affichage = (requete, reponse) => {
    livreModel.findById(requete.params.id)
    .populate("auteur")
    .exec()
    .then(livre => {
        reponse.render("livres/livre.html.twig",{livre : livre, isModification:false})
    })
    .catch(error => {
        console.log(error);
    })
}

// fonction pour modifier un livre (formulaire)
exports.livre_modification = (requete, reponse) => {
    AuteurModel.find()
    .exec()
    .then(auteurs => {
        livreModel.findById(requete.params.id)
        .populate("auteur")
        .exec()
        .then(livre => {
            reponse.render("livres/livre.html.twig",{
                livre : livre, 
                auteurs: auteurs, 
                isModification:true
            })
        })
        .catch(error => {
            console.log(error);
        })
    })
    .catch(error => {
        console.log(error);
    })    
}

// Fonction pour enregistrer en BD les modifiations 
exports.livre_modification_validation = (requete, reponse) => {
    const livreUpdate = {
        nom: requete.body.titre,
        auteur: requete.body.auteur,
        pages: requete.body.pages,
        description: requete.body.description
    }
    livreModel.update({_id:requete.body.identifiant}, livreUpdate)
    .exec()
    .then(resultat => {
        if(resultat.nModified < 1) {
            throw new Error("Requête de modification échouée !");
        }
        requete.session.message = {
            type: 'success',
            contenu: 'Modification effectuée avec succès !'
        }
        reponse.redirect("/livres");
    })
    .catch(error => {
        console.log(error);
        requete.session.message = {
            type: 'danger',
            contenu: error.message
        }
        reponse.redirect("/livres");
    })
}

// fonction pour la modification de l'image
exports.livre_modification_validation_image = (requete, reponse) => {
    var livre = livreModel.findById(requete.body.identifiant)
    .select("image") // on recupere l'image
    .exec()
    .then(livre => {
        fs.unlink("./public/images/"+livre.image, error => {
            console.log(error);
        })
    });
    const livreUpdate = {
        image: requete.file.path.substring(14)
    }
    livreModel.update({_id:requete.body.identifiant}, livreUpdate)
    .exec()
    .then(resultat => {
        reponse.redirect("/livres/modification/"+requete.body.identifiant)
    })
    .catch(error => {
        console.log(error);
    })
}

// fonction pour supprimer un livre
exports.livre_suppression = (requete, reponse) => {
    var livre = livreModel.findById(requete.params.id)
    .select("image") // on recupere l'image
    .exec()
    .then(livre => {
        fs.unlink("./public/images/"+livre.image, error => {
            console.log(error);
        })
        livreModel.remove({_id:requete.params.id})
        .exec()
        .then(resultat => {
            requete.session.message = {
                type: 'success',
                contenu: 'Suppression effectuée !'
            }
            reponse.redirect("/livres");
        })
        .catch(error => {
            console.log(error);
        })
    })
    .catch(error => {
        console.log(error);
    })
}




