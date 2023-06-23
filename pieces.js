// Récupération des pièces depuis le fichier JSON
const reponse = await fetch("pieces-autos.json");
const pieces = await reponse.json();

function genererPieces (pieces) {
    for (let i = 0; i < pieces.length; i++) {
        const article = pieces[i];
        const imageElement = document.createElement("img");
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
        sectionFiches.appendChild(imageElement);
        sectionFiches.appendChild(nomElement);
        sectionFiches.appendChild(prixElement);
        sectionFiches.appendChild(categorieElement);
        sectionFiches.appendChild(descriptionElement);
        sectionFiches.appendChild(disponibiliteElement);
    }
}

genererPieces (pieces);

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