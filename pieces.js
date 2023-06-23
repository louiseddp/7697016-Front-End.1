import { ajoutListenersAvis, ajoutListenerEnvoyerAvis, afficheAvis } from "./avis.js";

//Récupération des pièces eventuellement stockées dans le localStorage
let pieces = window.localStorage.getItem('pieces');
if (pieces === null){
   // Récupération des pièces depuis l'API
   const reponse = await fetch('http://localhost:8081/pieces/');
   pieces = await reponse.json();
   // Transformation des pièces en JSON
   const valeurPieces = JSON.stringify(pieces);
   // Stockage des informations dans le localStorage
   window.localStorage.setItem("pieces", valeurPieces);
}else{
   pieces = JSON.parse(pieces);
}

ajoutListenerEnvoyerAvis();

function genererPieces (pieces) {
    for (let i = 0; i < pieces.length; i++) {
        const article = pieces[i];
        const imageElement = document.createElement("img");
        const pieceElement = document.createElement("article");

        imageElement.src = article.image;
        const nomElement = document.createElement("h2");
        nomElement.innerText = article.nom;
        const prixElement = document.createElement("p");
        prixElement.innerText = `Prix: ${article.prix} € (${article.prix < 35 ? "€" : "€€€"})`;
        const categorieElement = document.createElement("p");
        categorieElement.innerText = article.categorie ?? "aucune catégorie";
        const descriptionElement = document.createElement("p");
        descriptionElement.innerText = article.description ?? ("aucune description");
        const disponibiliteElement = document.createElement("p");
        disponibiliteElement.innerText = `${article.disponibilite === true ? "En stock" : "Rupture de stock"}`;
        const sectionFiches = document.querySelector(".fiches");

        // ajout du bouton pour les avis
        const avisBouton = document.createElement("button");

        // add an id to the button to get the correct number in the json database
        avisBouton.dataset.id = article.id;
        avisBouton.textContent = "Afficher les avis";

        sectionFiches.appendChild(pieceElement);
        pieceElement.appendChild(imageElement);
        pieceElement.appendChild(nomElement);
        pieceElement.appendChild(prixElement);
        pieceElement.appendChild(categorieElement);
        pieceElement.appendChild(descriptionElement);
        pieceElement.appendChild(disponibiliteElement);
        pieceElement.appendChild(avisBouton);
    }
            
    ajoutListenersAvis();
}

genererPieces (pieces);

for(let i = 0; i < pieces.length; i++){
    const id = pieces[i].id;
    const avisJSON = window.localStorage.getItem(`avis-piece-${id}`);
    const avis = JSON.parse(avisJSON);

    if(avis !== null){
        const pieceElement = document.querySelector(`article[data-id="${id}"]`);
        afficheAvis(pieceElement, avis);
    }
}

const boutonTrier = document.querySelector(".btn-trier");
boutonTrier.addEventListener("click", () => {
    const piecesOrdonnees = Array.from(pieces);
    piecesOrdonnees.sort(function (a, b) {
        return a.prix - b.prix;
    });
    document.querySelector(".fiches").innerHTML = "";
    console.log(piecesOrdonnees);
    genererPieces(piecesOrdonnees);
});

const boutonTrierDecroissant = document.querySelector(".btn-decroissant");
boutonTrierDecroissant.addEventListener("click", () => {
    const piecesOrdonneesDecroissant = Array.from(pieces);
    piecesOrdonneesDecroissant.sort(function (a, b) {
        return b.prix - a.prix;
    })
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesOrdonneesDecroissant);
});

const boutonFiltrer = document.querySelector(".btn-filtrer");
boutonFiltrer.addEventListener("click", () => {
    const piecesAbordables = 
    pieces.filter((a) => {
        return a.prix <= 35;
    })
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesAbordables);
});

const boutonFiltrerDescription = document.querySelector(".btn-description");
boutonFiltrerDescription.addEventListener("click", () => {
    const piecesDescription = 
    pieces.filter((a) => {
        return a.description; // de type bool et vaut false quand le champ n'est pas rempli
    })
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesDescription);
});

const noms= pieces.map(piece => piece.nom);
for(let i = pieces.length -1 ; i >= 0; i--){
   if(pieces[i].prix > 35){
       noms.splice(i,1)
   }
}

const prixDispo= pieces.map(piece => piece.prix);
const nomsDispo= pieces.map(piece => piece.nom);
for(let i = pieces.length -1 ; i >= 0; i--){
   if(pieces[i].disponibilite===false){
       prixDispo.splice(i,1);
       nomsDispo.splice(i,1);
   }
}
//Création de la liste
const abordablesElements = document.createElement('ul');
//Ajout de chaque nom à la liste
for(let i=0; i < noms.length ; i++){
   const nomElement = document.createElement('li');
   nomElement.innerText = noms[i]
   abordablesElements.appendChild(nomElement);
}

document.querySelector('.abordables')
   .appendChild(abordablesElements);

//Création de la liste
const dispoElements = document.createElement('ul');
//Ajout de chaque nom à la liste
for(let i=0; i < noms.length ; i++){
   const nomElement = document.createElement('li');
   nomElement.innerText = nomsDispo[i] + " -" + prixDispo[i] + "€";
   dispoElements.appendChild(nomElement);
}
// Ajout de l'en-tête puis de la liste au bloc résultats filtres
document.querySelector('.dispos')
   .appendChild(dispoElements);

// gestion de l'input de type range

const inputRange = document.getElementById("prixmax");
inputRange.addEventListener("change", (event) => {
    const piecesFiltrees = 
    pieces.filter ((a) => {
        return a.prix <= event.target.value;
    })
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesFiltrees);
  });

  // Ajout du listener pour mettre à jour des données du localStorage
const boutonMettreAJour = document.querySelector(".btn-maj");
boutonMettreAJour.addEventListener("click", function () {
  window.localStorage.removeItem("pieces");
});