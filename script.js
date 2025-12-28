const buttons = document.querySelectorAll(".add-btn");
const panier = document.querySelector(".panier-produits");

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const card = button.closest(".product-card");
    const nom = card.querySelector("h3").textContent;
    const imageSrc = card.querySelector("img").src;

    const productId = nom.replace(/\s+/g, "-").toLowerCase();

    if (button.classList.contains("validated")) {
      button.classList.remove("validated");
      button.textContent = "Ajouter au panier";
      const produitPanier = panier.querySelector(`[data-id="${productId}"]`);
      if (produitPanier) produitPanier.remove();
      return;
    }

    button.classList.add("validated");
    button.textContent = "Validé";

    const produitPanier = document.createElement("div");
    produitPanier.classList.add("produit-panier");
    produitPanier.dataset.id = productId;

    produitPanier.innerHTML = `
      <img src="${imageSrc}" alt="${nom}">
      <div class="produit-info">
        <p class="produit-nom">${nom}</p>
      </div>
      <div class="produit-quantite">
        <button class="moins">-</button>
        <span>1</span>
        <button class="plus">+</button>
      </div>
      <button class="produit-supprimer">✕</button>
    `;

    panier.appendChild(produitPanier);

    produitPanier.querySelector(".produit-supprimer").addEventListener("click", () => {
      produitPanier.remove();
      button.classList.remove("validated");
      button.textContent = "Ajouter au panier";
    });

    const span = produitPanier.querySelector("span");
    produitPanier.querySelector(".plus").onclick = () => {
      span.textContent = Number(span.textContent) + 1;
    };
    produitPanier.querySelector(".moins").onclick = () => {
      if (span.textContent > 1) {
        span.textContent = Number(span.textContent) - 1;
      }
    };
  });
});

