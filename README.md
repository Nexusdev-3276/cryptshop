# Cryptshop

Boutique en ligne de manettes, PC gaming assemblés et trottinettes électriques.
Paiement en Bitcoin, Ethereum ou Solana. Livraison en France, Belgique, Suisse et Canada.

Site Next.js 16 (App Router), sans base de données obligatoire : chaque commande déclenche une
notification Telegram (et éventuellement Discord) avec le détail complet.

## Démarrage local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Le site est disponible sur http://localhost:3000.

## Configuration

### 1. Notifications de commandes (Telegram)

1. Ouvrez Telegram et parlez à **@BotFather**.
2. Envoyez `/newbot`, choisissez un nom, puis récupérez le **token**.
3. Envoyez un message à votre bot (par exemple « test »).
4. Ouvrez dans un navigateur :
   `https://api.telegram.org/bot<VOTRE_TOKEN>/getUpdates`
5. Récupérez la valeur `"chat":{"id":...}`.
6. Renseignez dans `.env.local` :

```
TELEGRAM_BOT_TOKEN=123456:ABC...
TELEGRAM_CHAT_ID=123456789
```

Chaque commande envoyée depuis le site arrive alors dans Telegram avec : référence, client,
adresse, articles, total, crypto choisie et adresse de paiement.

Option Discord : créez un webhook de salon et renseignez `DISCORD_WEBHOOK_URL`.

### 2. Adresses de paiement

```
BTC_ADDRESS=...
ETH_ADDRESS=...
SOL_ADDRESS=...
```

Sans ces adresses, la page de confirmation affiche « l'adresse vous sera communiquée par e-mail ».
**Renseignez-les avant la mise en ligne.**

### 3. Historique facultatif (Upstash Redis)

Créez une base gratuite sur https://upstash.com, puis renseignez
`UPSTASH_REDIS_REST_URL` et `UPSTASH_REDIS_REST_TOKEN`. Les 500 dernières commandes sont
conservées. Le site fonctionne parfaitement sans.

### 4. E-mail de contact

`NEXT_PUBLIC_CONTACT_EMAIL` (valeur par défaut : `contact@cryptshop.store`).

## Produits, prix et images

- Produits et prix : `src/lib/products.ts` (prix en euros, TTC).
- Frais de port et seuils de gratuité : `src/lib/currency.ts`.
- Images : déposez les fichiers dans `public/images/products/` en respectant les noms indiqués
  dans le README du dossier. Un visuel de remplacement s'affiche tant que l'image est absente.
- Textes légaux : `src/app/mentions-legales`, `src/app/cgv`, `src/app/confidentialite`.

Les taux crypto (CoinGecko) et de change (Frankfurter) sont récupérés côté serveur et mis en
cache 10 minutes. En cas d'indisponibilité, des taux de secours sont utilisés.

## Déploiement Vercel

```bash
npm i -g vercel
vercel link
vercel env add TELEGRAM_BOT_TOKEN
vercel env add TELEGRAM_CHAT_ID
vercel env add BTC_ADDRESS
vercel env add ETH_ADDRESS
vercel env add SOL_ADDRESS
vercel --prod
```

Ou importez le dépôt GitHub dans le tableau de bord Vercel, puis ajoutez les variables
d'environnement dans **Settings → Environment Variables**.

Pensez à mettre `NEXT_PUBLIC_SITE_URL` à jour avec l'URL finale (utilisée pour le sitemap et les
métadonnées).

## Structure

```
src/app/                 pages (boutique, produit, panier, commande, pages légales)
src/app/api/orders/      création de commande + notification
src/app/api/contact/     formulaire de contact + notification
src/components/          interface (panier, tunnel, cartes produit)
src/lib/products.ts      catalogue
src/lib/currency.ts      pays, devises, frais de port
src/lib/rates.ts         taux crypto et change
src/lib/notify.ts        Telegram / Discord
```
