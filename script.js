// ===============================
// LOCAL STORAGE
// ===============================
function getPanier() {
  return JSON.parse(localStorage.getItem("panier")) || [];
}

function savePanier(panier) {
  localStorage.setItem("panier", JSON.stringify(panier));
}

// ===============================
// VÉRIFIER SI PRODUIT DANS PANIER
// ===============================
function isInPanier(id) {
  const panier = getPanier();
  return panier.some(p => p.id === id);
}

// ===============================
// BADGE PANIER
// ===============================
function updateCartCount() {
  const panier = getPanier();
  const count = panier.reduce((t, p) => t + p.quantite, 0);
  const badge = document.querySelector(".cart-count");
  if (badge) badge.textContent = count;
}

// ===============================
// BOUTONS AJOUT PANIER
// ===============================
const addButtons = document.querySelectorAll(".add-btn");

addButtons.forEach(button => {
  const card = button.closest(".product-card");
  const nom = card.querySelector("h3").textContent;
  const prix = parseInt(card.querySelector(".prix").textContent);
  const image = card.querySelector("img").src;
  const id = nom.replace(/\s+/g, "-").toLowerCase();

  // 🔁 ÉTAT AU CHARGEMENT
  if (isInPanier(id)) {
    button.classList.add("validated");
    button.textContent = "Validé";
  }

  button.addEventListener("click", () => {
    let panier = getPanier();
    const index = panier.findIndex(p => p.id === id);

    // ❌ RETIRER
    if (index !== -1) {
      panier.splice(index, 1);
      savePanier(panier);
      button.classList.remove("validated");
      button.textContent = "Ajouter au panier";
      updateCartCount();
      return;
    }

    // ✅ AJOUTER
    panier.push({
      id,
      nom,
      prix,
      image,
      quantite: 1
    });

    savePanier(panier);
    button.classList.add("validated");
    button.textContent = "Validé";
    updateCartCount();
  });
});

// ===============================
// AFFICHAGE PANIER
// ===============================
const panierContainer = document.querySelector(".panier-produits");

if (panierContainer) afficherPanier();

function afficherPanier() {
  const panier = getPanier();
  panierContainer.innerHTML = "";

  let total = 0;

  panier.forEach(produit => {
    total += produit.prix * produit.quantite;

    const div = document.createElement("div");
    div.className = "produit-panier";

    div.innerHTML = `
      <img src="${produit.image}">
      <div class="org">
      <div class="produit-info">
        <p>${produit.prix} DA</p>
      </div>
      <div class="alg">
      <div class="produit-quantite">
        <button class="moins">-</button>
        <span>${produit.quantite}</span>
        <button class="plus">+</button>
      </div>
      <button class="produit-supprimer">✕</button>
      </div>
      </div>
    `;

    div.querySelector(".plus").onclick = () => {
      produit.quantite++;
      savePanier(panier);
      afficherPanier();
      updateCartCount();
    };

    div.querySelector(".moins").onclick = () => {
      if (produit.quantite > 1) produit.quantite--;
      savePanier(panier);
      afficherPanier();
      updateCartCount();
    };

    div.querySelector(".produit-supprimer").onclick = () => {
      const newPanier = panier.filter(p => p.id !== produit.id);
      savePanier(newPanier);
      afficherPanier();
      updateCartCount();
    };

    panierContainer.appendChild(div);
  });

  document.querySelector(".total-produits").textContent = total + " DA";
  document.querySelector(".total").textContent = total + 400 + " DA";
}


updateCartCount();

  const burger = document.getElementById("burger");
  const navLinks = document.getElementById("navLinks");

  burger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
 const toggleBtn = document.getElementById("themeToggle");
const body = document.body;

// Charger le mode sauvegardé
const savedTheme = localStorage.getItem("theme");

if (savedTheme) {
  body.classList.add(savedTheme);
} else {
  body.classList.add("light-mode");
}

// Emoji correct selon le mode ACTUEL
toggleBtn.textContent =
  body.classList.contains("dark-mode") ? "🌙" : "☀️";

// Switch mode
toggleBtn.addEventListener("click", () => {
  if (body.classList.contains("light-mode")) {
    body.classList.replace("light-mode", "dark-mode");
    localStorage.setItem("theme", "dark-mode");
    toggleBtn.textContent = "🌙"; // revenir au clair
  } else {
    body.classList.replace("dark-mode", "light-mode");
    localStorage.setItem("theme", "light-mode");
    toggleBtn.textContent = "☀️"; // passer au sombre
  }
});



