# Disp-Discord-Bot

## Description

Disp-Discord-Bot est un bot Discord qui permet aux utilisateurs de spécifier leurs disponibilités pour la semaine et de signaler des événements spéciaux pour certains jours. Le bot utilise des commandes pour interagir avec les utilisateurs et gérer les messages dans un canal Discord.

## Fonctionnalités

- Envoyer les jours de la semaine pour que les utilisateurs puissent indiquer leurs disponibilités en fonction des évènements.
- Gestion des réactions aux messages pour indiquer des présences (✅/❌).
- Effacer les messages du canal, y compris ceux de l'utilisateur et du bot, avec une commande dédiée.

## Prérequis

- Node.js (version 12.0 ou supérieure)
- npm (Node Package Manager)
- Un compte Discord et un serveur où vous avez la permission d'ajouter des bots.
- Un token de bot Discord (obtenez-le depuis le [portail des développeurs Discord](https://discord.com/developers/applications)).

## Installation

1. Clonez le dépôt :

    ```sh
    git clone https://github.com/votre-nom-utilisateur/votre-depot.git
    cd votre-depot
    ```

2. Installez les dépendances :

    ```sh
    npm install
    ```

3. Créez un fichier `.env` à la racine du projet et ajoutez-y votre token de bot Discord :

    ```env
    DISCORD_TOKEN=your-discord-bot-token
    ```

4. Modifiez le fichier `config.js` pour ajuster les rôles mentionnés et emojis de présences.

5. Structure du projet :

    Assurez-vous que votre projet est structuré comme suit :

    ```
    votre-depot/
    ├── commands/
    │   ├── clear.js
    │   ├── disp.js
    │   ├── help.js
    │   └── modify.js
    ├── .env
    ├── .gitignore
    ├── config.js
    ├── index.js
    ├── package.json
    └── README.md
    ```

## Utilisation

1. Pour démarrer le bot :

    ```sh
    node index.js
    ```

2. Une fois le bot en ligne, utilisez les commandes suivantes dans votre serveur Discord :

    - `!7clear` : Le bot supprimera par défaut les 100 messages les plus récents du canal, y compris ceux de l'utilisateur et du bot.
    - `!7disp` : Le bot demandera les disponibilités pour chaque jour de la semaine et posera des questions sur les événements spéciaux.
    - `!7help` : Le bot supprimera par défaut les 100 messages les plus récents du canal, y compris ceux de l'utilisateur et du bot.
    - `!7modify` : Le bot supprimera par défaut les 100 messages les plus récents du canal, y compris ceux de l'utilisateur et du bot.
