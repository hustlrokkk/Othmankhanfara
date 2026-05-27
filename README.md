# quedelaperf — Portfolio Othman Khanfara

Site construit avec [Astro](https://astro.build) (générateur de site statique). Le design reste 100 % statique et rapide ; le blog se rédige en **Markdown**.

## Développement local

```bash
npm install        # une seule fois
npm run dev        # serveur de dev → http://localhost:4321/Othmankhanfara/
npm run build      # build de production → dossier dist/
npm run preview    # prévisualise le build de production
```

## Structure

```
public/            # fichiers servis tels quels (styles.css, main.js, assets/)
src/
  layouts/BaseLayout.astro   # en-tête, menu, pied de page communs à toutes les pages
  pages/
    index.astro              # accueil
    a-propos.astro           # page À propos
    blog/index.astro         # liste des articles
    blog/[...slug].astro     # gabarit d'un article
    rss.xml.js               # flux RSS du blog
  content/blog/*.md          # LES ARTICLES DE BLOG (un fichier = un article)
  content.config.ts          # schéma des articles
```

## Publier un nouvel article de blog

1. Crée un fichier `src/content/blog/mon-article.md` (le nom du fichier = l'URL).
2. Ajoute l'en-tête (frontmatter) puis le contenu en Markdown :

```markdown
---
title: "Titre de l'article"
description: "Résumé en une phrase (affiché dans la liste + SEO)."
pubDate: 2026-06-01
tags: ["Meta Ads", "SEO"]
draft: false        # mets true pour un brouillon non publié
---

Le contenu de l'article en **Markdown** : titres ##, listes, liens, images...
```

3. `git add`, `git commit`, `git push` → le site se reconstruit et se déploie tout seul.

## Déploiement (GitHub Pages)

Le workflow `.github/workflows/deploy.yml` build et déploie à chaque push sur `main`.

**À faire une seule fois** dans le repo GitHub :
`Settings → Pages → Build and deployment → Source = GitHub Actions`.

Le site sera servi sur `https://hustlrokkk.github.io/Othmankhanfara/`.

> Si tu branches un **domaine personnalisé** plus tard : ajoute-le dans Settings → Pages,
> puis mets `base: '/'` dans `astro.config.mjs` (toutes les URLs s'adaptent automatiquement
> car elles utilisent `import.meta.env.BASE_URL`).
