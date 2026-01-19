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
  return panier.some((p) => p.id === id);
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

addButtons.forEach((button) => {
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

    // 🛒 Récupérer le panier (tableau simple)
    let panier = JSON.parse(localStorage.getItem("panier")) || [];

    const index = panier.findIndex((p) => p.id === id);

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
      user: currentUser, // ⚡ On garde la trace de l'utilisateur
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

  panier.forEach((produit) => {
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
      const newPanier = panier.filter((p) => p.id !== produit.id);
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

themeToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    body.classList.toggle("light-mode");

    localStorage.setItem(
      "theme",
      body.classList.contains("dark-mode") ? "dark-mode" : "light-mode",
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

// ======= Fermer si clic hors modal or close button =======
const closeModalLogin = document.getElementById("closeModalLogin");
const closeModalCommande = document.getElementById("closeModalCommande");

if (closeModalLogin) {
  closeModalLogin.addEventListener("click", () => {
    modal.style.display = "none";
  });
}

if (closeModalCommande) {
  closeModalCommande.addEventListener("click", () => {
    modalCommande.style.display = "none";
  });
}

window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
  if (e.target === modalCommande) modalCommande.style.display = "none";
});

// ======= Close modals with ESC key =======
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (modal && modal.style.display === "flex") modal.style.display = "none";
    if (modalCommande && modalCommande.style.display === "flex")
      modalCommande.style.display = "none";
  }
});

// ======= Connexion =======
btnConnexion.addEventListener("click", () => {
  const email = document.getElementById("email").value.trim();
  const mdp = document.getElementById("mdp").value;
  const comptes = JSON.parse(localStorage.getItem("comptes")) || [];

  const user = comptes.find((c) => c.email === email && c.mdp === mdp);
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
  if (comptes.some((c) => c.email === email)) {
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
  addButtons.forEach((button) => {
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

// ======= Global Enter-to-submit for forms (safe, non-intrusive) =======
document.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;

  const active = document.activeElement;
  if (!active) return;

  const tag = active.tagName;
  if (tag === "TEXTAREA" || tag === "BUTTON") return;
  if (active.isContentEditable) return;

  const form = active.closest && active.closest("form");
  if (!form) return;

  e.preventDefault();
  if (typeof form.requestSubmit === "function") {
    form.requestSubmit();
  } else {
    const submitBtn = form.querySelector(
      'button[type="submit"], input[type="submit"]',
    );
    if (submitBtn) submitBtn.click();
    else form.submit();
  }
});

// Appel initial
updateAuthButtons();
const btnCommande = document.querySelector(".btn-commande");
const modalCommande = document.getElementById("modalCommande");
const envoyerCommande = document.getElementById("envoyerCommande");
btnCommande.addEventListener("click", () => {
  const panier = JSON.parse(localStorage.getItem("panier")) || [];

  if (panier.length === 0) {
    alert("Votre panier est vide.");
    return;
  }

  modalCommande.style.display = "flex";
});
function genererCommandeEmail() {
  const panier = JSON.parse(localStorage.getItem("panier")) || [];

  let message = "";
  let totalProduits = 0;

  panier.forEach((p) => {
    message += `• ${p.nom} x${p.quantite} — ${p.prix * p.quantite} DA\n`;
    totalProduits += p.prix * p.quantite;
  });

  const livraison = 400;
  const total = totalProduits + livraison;

  message += `\nProduits : ${totalProduits} DA`;
  message += `\nLivraison : ${livraison} DA`;
  message += `\nTOTAL : ${total} DA`;

  return message;
}
function genererCommandeEmailProduits() {
  const panier = JSON.parse(localStorage.getItem("panier")) || [];
  return panier
    .map((p) => `• ${p.nom} x${p.quantite} — ${p.prix * p.quantite} DA`)
    .join("\n");
}
emailjs.init("zE1enW3eqgYJxdpml");
// ======= Envoi commande (EmailJS) =======
if (envoyerCommande) {
  envoyerCommande.addEventListener("click", () => {
    const prenom = document.getElementById("prenomCmd").value.trim();
    const nom = document.getElementById("nomCmd").value.trim();
    const tel = document.getElementById("telCmd").value.trim();
    const ville = document.getElementById("villeCmd").value.trim();
    const emailClient = document.getElementById("emailCmd").value.trim();

    if (!prenom || !nom || !tel || !ville || !emailClient) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    // simple email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailClient)) {
      alert("Veuillez entrer une adresse email valide.");
      return;
    }

    const panier = JSON.parse(localStorage.getItem("panier")) || [];
    let totalProduits = 0;
    panier.forEach((p) => {
      totalProduits += p.prix * p.quantite;
    });
    const livraison = 400;
    const total = totalProduits + livraison;

    const adminParams = {
      to_email: "contact@aerys.com",
      prenom: prenom,
      nom: nom,
      tel: tel,
      email: emailClient,
      ville: ville,
      commande: genererCommandeEmailProduits(),
      total_produits: totalProduits,
      livraison: livraison,
      total: total,
    };

    // first send admin email, then send client confirmation
    emailjs
      .send("service_h2725g5", "template_mwy578k", adminParams)
      .then(() => {
        // send client email
        // send client email
        return emailjs.send("service_h2725g5", "template_mngegpg", {
          email: emailClient, // correspond exactement à {{email}}
          nom: prenom, // correspond à {{nom}} dans le template
          total: total, // correspond à {{total}} dans le template
        });
      })
      .then(() => {
        alert("Commande envoyée avec succès !");
        localStorage.removeItem("panier");
        if (modalCommande) modalCommande.style.display = "none";
        location.reload();
      })
      .catch((err) => {
        alert("Erreur lors de l’envoi.");
        console.error(err);
      });
  });
}

// ======= Allow Enter to submit the order modal (no form present) =======
if (modalCommande) {
  modalCommande.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;

    const active = document.activeElement;
    if (!active) return;

    if (
      modalCommande.contains(active) &&
      active.tagName === "INPUT" &&
      active.type !== "button" &&
      active.type !== "submit"
    ) {
      e.preventDefault();
      if (envoyerCommande) envoyerCommande.click();
    }
  });
}
