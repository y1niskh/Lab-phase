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

// Fonction pour ouvrir la modale
function ouvrirFenetreConnexion() {
  const modal = document.getElementById("modalLogin");
  modal.style.display = "flex";
}

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
    const currentUser = localStorage.getItem("userConnecte");

    // ❌ Vérification utilisateur
    if (!currentUser) {
      ouvrirFenetreConnexion();
      return;
    }

    // 🛒 Récupérer le panier (tableau simple)
    let panier = JSON.parse(localStorage.getItem("panier")) || [];

    const index = panier.findIndex(p => p.id === id);

    // ❌ RETIRER
    if (index !== -1) {
      panier.splice(index, 1);
      localStorage.setItem("panier", JSON.stringify(panier));
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
      quantite: 1,
      user: currentUser // ⚡ On garde la trace de l'utilisateur
    });

    localStorage.setItem("panier", JSON.stringify(panier));
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
const themeToggles = document.querySelectorAll(".theme-toggle");
const body = document.body;

const savedTheme = localStorage.getItem("theme");
body.classList.add(savedTheme || "light-mode");

themeToggles.forEach(toggle => {
  toggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    body.classList.toggle("light-mode");

    localStorage.setItem(
      "theme",
      body.classList.contains("dark-mode") ? "dark-mode" : "light-mode"
    );
  });
});
// ======= Références des éléments =======
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const modal = document.getElementById("modalLogin");
const btnConnexion = document.getElementById("btnConnexion");
const btnInscription = document.getElementById("btnInscription");
const mdpConfirmInput = document.getElementById("mdpConfirm");

// ======= Ouvrir la popup login =======
loginBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

// ======= Fermer si clic hors modal =======
window.addEventListener("click", e => {
  if (e.target === modal) modal.style.display = "none";
});

// ======= Connexion =======
btnConnexion.addEventListener("click", () => {
  const email = document.getElementById("email").value.trim();
  const mdp = document.getElementById("mdp").value;
  const comptes = JSON.parse(localStorage.getItem("comptes")) || [];

  const user = comptes.find(c => c.email === email && c.mdp === mdp);
  if (user) {
    localStorage.setItem("userConnecte", email);
    modal.style.display = "none";
    alert("Connecté !");
    updateAuthButtons(); // 🔹 met à jour les boutons
  } else {
    alert("Email ou mot de passe incorrect !");
  }
});

// ======= Inscription =======
btnInscription.addEventListener("click", () => {
  const email = document.getElementById("email").value.trim();
  const mdp = document.getElementById("mdp").value;
  const mdpConfirm = mdpConfirmInput.value;

  if (mdpConfirmInput.style.display === "none") {
    mdpConfirmInput.style.display = "block";
    return;
  }

  if (mdp !== mdpConfirm) {
    alert("Les mots de passe ne correspondent pas !");
    return;
  }

  let comptes = JSON.parse(localStorage.getItem("comptes")) || [];
  if (comptes.some(c => c.email === email)) {
    alert("Email déjà utilisé !");
    return;
  }

  comptes.push({ email, mdp });
  localStorage.setItem("comptes", JSON.stringify(comptes));
  localStorage.setItem("userConnecte", email);
  modal.style.display = "none";
  alert("Compte créé !");
  updateAuthButtons(); // 🔹 met à jour les boutons
});

// ======= Déconnexion =======
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("userConnecte");

  // Réinitialiser les boutons panier
  const addButtons = document.querySelectorAll(".add-btn");
  addButtons.forEach(button => {
    button.classList.remove("validated");
    button.textContent = "Ajouter au panier";
  });

  updateCartCount();
  updateAuthButtons();
});

// ======= Mise à jour des boutons login/logout =======
function updateAuthButtons() {
  const currentUser = localStorage.getItem("userConnecte");
  if (currentUser) {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
  } else {
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
  }
}

// Appel initial
updateAuthButtons();
