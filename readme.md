Application de partage
======================================

## Auteur
L'application ***ShareSphere*** a été créée par Patricia.

## Introduction
ShareSphere est une application de prêt d'objets où les utilisateurs peuvent créer un compte, se connecter, consulter une liste d'objets disponibles et emprunter ces objets. Les utilisateurs peuvent également ajouter des objets à la liste et supprimer les objets qu'ils ont empruntés. L'application utilise MongoDB pour stocker les données et Express pour gérer les requêtes HTTP.

## Sujet
[Cliquer pour accéder au sujet](https://www.fil.univ-lille.fr/~routier/enseignement/licence/jsfs/tdtp/shareApp.html)

## Rubrique How TO

*** Ouvrir un terminal dans le dossier de l'application. ***

#### Créer le dossier dbData
`mkdir dbData`

#### Installer les dépendances.
`npm install`

#### Lancer le processus du serveur de base de données MongoDB
`mongod --dbpath dbData`

#### Importer des objets dans la base de données
`mongoimport --db appBase --collection objects --file misc/objects.json`

#### Lancer l'application dans un autre terminal
`nodemon`

#### L'application sera disponible à l'adresse http://localhost:3000/

*** IMPORTANT : Pour vérifier les fonctionnalités avec plusieurs utilisateurs connectés, utiliser des navigateurs différents pour éviter un probleme de token.

## API de l'application ShareSphere

#### Présentation de l'application
1. ```/about/``` accessible au public.  

![about](https://zupimages.net/up/23/16/iig5.png)

#### Accueil

1. ```/``` définit la page d'accueil de l'application.  

![login](https://zupimages.net/up/23/16/nn00.png)

#### Authentification

1. ```/register``` gère l'affichage du formulaire d'inscription pour l'utilisateur via la méthode HTTP GET et le traitement de la soumission de ce formulaire (via la méthode HTTP POST). Elle redirige sur la page de connexion après la création de compte.  

![register](https://zupimages.net/up/23/16/36fk.png)  

![welcome](https://zupimages.net/up/23/16/5onv.png)

2. ```/login``` gère l'affichage du formulaire de connexion pour l'utilisateur (via la méthode HTTP GET) et le traitement de la soumission de ce formulaire (via la méthode HTTP POST).  

![login](https://zupimages.net/up/23/16/rfbi.png)

3. ```/logout``` gère la déconnexion de l'utilisateur (via la méthode HTTP GET) en effaçant le jeton d'authentification stocké dans un cookie.  

![logout](https://zupimages.net/up/23/16/d7e5.png)

#### User

1. ```/user/me/``` renvoie les informations (nom et identifiant) de l'utilisateur connecté.  

![logout](https://zupimages.net/up/23/16/d7e5.png)

#### Objets

1. ```/object/``` permet de récupérer tous les objets de l'application de partage (via la méthode HTTP GET).  Données transmises : aucune. Données reçues : tableau d'objets.  

![object](https://zupimages.net/up/23/16/rinu.png)

2. ```/object/``` permet à un utilisateur connecté de créer un nouvel objet et de le rendre disponible au partage (via la méthode POST). L'objet créé est associé à l'utilisateur qui l'a créé.
Données transmises : nom de l'objet, description, image (optionnel), tags. Données reçues : objet créé.

3. ```/object/borrow/:objectId/``` permet à un utilisateur connecté d'emprunter un objet en spécifiant son ID (via la méthode HTTP PUT). L'application met à jour l'état de l'objet pour le marquer comme emprunté et associe l'ID de l'utilisateur qui l'a emprunté.
Données transmises : aucune. Données reçues : objet mis à jour.  

![other1](https://zupimages.net/up/23/16/bhvt.png)  

![other2](https://zupimages.net/up/23/16/2d31.png)  

4. ```/object/return/:objectId/``` permet à un utilisateur connecté de retourner un objet emprunté en spécifiant son ID (via la méthode HTTP PUT). L'application met à jour l'état de l'objet pour le marquer comme disponible et retire l'association de l'ID de l'utilisateur qui l'avait emprunté.
Données transmises : aucune. Données reçues : objet mis à jour.

5. ```/object/:objectId/``` permet à un utilisateur connecté de supprimer un objet qu'il a créé en spécifiant son ID (via la méthode HTTP DELETE). L'objet est supprimé de la base de données.
Données transmises : aucune. Données reçues : objet supprimé.

6. ```/object/others/``` permet de récupérer la liste des objets empruntés par d'autres utilisateurs (via la méthode GET).  


7. ```/object/update/:objectId/``` permet de mettre à jour la description d'un objet (via la méthode PUT).

## Utilisation de socket  

L'utilisation de socket.io dans cette application permet une communication en temps réel entre le serveur et les clients, permettant une mise à jour automatique de l'affichage des objets empruntés ou disponibles, sans avoir à recharger la page.

Plus précisément, lorsque l'état d'un objet est modifié (ajouté, supprimé, emprunté, retourné, modifié), le serveur émet un événement approprié à tous les clients connectés. Chaque client est donc informé en temps réel de ces changements et peut mettre à jour son interface utilisateur en conséquence. Ainsi, les clients sont en permanence informés de l'état actuel de l'application et peuvent agir en conséquence.

Cela permet également une expérience utilisateur plus fluide, car les utilisateurs n'ont pas besoin de recharger la page pour voir les mises à jour et peuvent voir instantanément si un objet est disponible ou non.

## Compétences acquises

Tout d'abord, j'ai développé mes compétences en JavaScript pour développer une application web interactive en temps réel, en utilisant la bibliothèque Socket.io pour faciliter la communication entre le client et le serveur. J'ai également appris à utiliser Express pour créer un serveur web en utilisant Node.js.  

En outre, j'ai mis en pratique les cours en HTML et CSS pour concevoir une interface utilisateur élégante et intuitive.  

Enfin, la création de cette application a développé ma capacité à résoudre les problèmes rencontrés lors du développement, à gérer mon temps et mes tâches de manière efficace et enfin à exprimer ma créativité sans avoir à me conformer à des exigences spécifiques.

## Améliorations 

Tout d'abord, une des améliorations que je pourrais apporter serait le refactoring du code du fichier object.client.js. La méthode displayAllObjects est assez longue et pourrait être décomposée en trois sous-fonctions (displayAvailableObjects, displayBorrowedObjects et displayObjectsOfOthers) pour améliorer la lisibilité et la maintenabilité du code.

De plus, je pourrais ajouter davantage de fonctionnalités à l'application. Par exemple, inclure des images pour chaque objet.  

Enfin, il serait également possible d'améliorer l'interface utilisateur de l'application. Le design pourrait être amélioré pour rendre l'application plus attrayante.
