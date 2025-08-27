# Mars Code Aurora – Army Builder

## 📖 Description
Application web en **Vue 3** pour créer et gérer des **escouades** dans l’univers du jeu de figurines **Mars Code Aurora**.  

Elle permet de :
- Parcourir les différentes **factions** et leurs profils.
- Construire une escouade en respectant les règles officielles (coût, officiers, blindés, restrictions spécifiques…).
- Modifier, équiper et spécialiser les unités.
- Générer un **PDF imprimable** de l’escouade.

---

## 🚀 Fonctionnalités principales
- **Navigation claire** : Factions → Faction → Escouade.
- **Gestion des contraintes** :
  - Limites de coût en fonction du mode (Blitz, Standard, Héroïque).
  - Nombre maximum d’officiers.
  - Restrictions spécifiques (Igualdad, Domination, Fortune, etc.).
- **Édition avancée des profils** :
  - Nom, grade, spécialités, équipements.
  - Options spéciales : Capitaine, Héroïque, Brutal, Structure légère…
- **Résumé et alertes** : suivi automatique des limites et règles.
- **Export PDF** via `html2pdf.js`.
- **Interface responsive** adaptée mobile et desktop.

---

## 🛠️ Stack technique
- **Framework** : [Vue 3](https://vuejs.org/) (Composition API, `<script setup>`)
- **Routing** : [Vue Router](https://router.vuejs.org/)
- **Styling** : [SCSS](https://sass-lang.com/) avec variables globales
- **Librairies externes** :
  - [`html2pdf.js`](https://github.com/eKoopmans/html2pdf.js) : génération PDF
- **Données** : fichier JSON (`armyBook.json`) contenant factions, profils, règles et équipements

---

## 📂 Structure du projet
