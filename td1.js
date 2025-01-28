function afficheVille() {
    // 1. Récupération de la valeur courante du select avec son id
    let selectElement = document.getElementById("villes");
    let nomVilleChoisie = selectElement.options[selectElement.selectedIndex].value;

    // 2. Récupération de la liste de toutes les div correspondant à une div de météo
    let villes = document.getElementsByClassName("ville");

    // 3. Parcours de la liste des div météo. On cache celles non sélectionnées.
    for (let i = 0; i < villes.length; i++) {
        let ville = villes[i];
        if (ville.id === nomVilleChoisie) {
            // garder l'élément visible
            ville.style.display = "";
        } else {
            // cacher l'élément
            ville.style.display = "none";
        }
    }
}
