const socket = io();
let userinfo;
const availableDiv = document.getElementById('available-section');
const borrowedDiv = document.getElementById('borrowed-section');
const othersDiv = document.getElementById("borrowed-by-others-section");
const addBtn = document.querySelector('.add-btn');
const MAX_BORROW = 2;

// sets up event listeners
const setup = () => {
  userinfo = document.getElementById('user');
  getUser();
  addBtn.addEventListener('click', () => {
    addNewObject();
    document.querySelector('#newObject').value = ''; // On efface le contenu après la validation
  });
  document.getElementById('logout').addEventListener('click', logout);

  displayAllObjects();

  socket.on('objectCreated', (objectId) => {
    displayAllObjects();
  });

  socket.on('objectDeleted', (objectId) => {
    displayAllObjects();
  });

  socket.on('objectBorrowed', (objectId) => {
    displayAllObjects();
  });

  socket.on('objectReturned', (objectId) => {
    displayAllObjects();
  });

  socket.on('objectModified', (objectId) => {
    displayAllObjects();
  });
};

window.addEventListener('DOMContentLoaded', setup);


// display available objects
const displayAllObjects = async () => {
  availableDiv.innerHTML = '';
  borrowedDiv.innerHTML = '';
  const requestOptions = {
    method: 'GET'
  };
  const response = await fetch('/object/', requestOptions);
  if (!response.ok) {
    throw new Error('Response not ok');
  }
  const objects = await response.json();
  const availableObjects = objects.filter(object => !object.isBorrowed);
  const userId = await getUser();
  const borrowedObjectsList = objects.filter(object => object.isBorrowed && object.borrower === userId);

  // affichage des objets disponibles
  let availableList = document.createElement('ul');
  availableList.className = 'available-list';
  const availableTitle = document.createElement('h2');
  availableTitle.innerHTML = 'Objets disponibles : ';
  availableObjects.forEach(object => {
    let li = document.createElement('li');
    li.className = 'available-item';
    let objectDiv = document.createElement('div');
    objectDiv.className = 'object-description';
    objectDiv.textContent = object.description;
    let modifyButton = document.createElement('button');
    modifyButton.className = 'modify-btn';
    modifyButton.textContent = 'Modifier';
    modifyButton.setAttribute('data-id', object._id);
    let borrowButton = document.createElement('button');
    borrowButton.className = 'borrow-btn';
    borrowButton.textContent = 'Emprunter';
    borrowButton.setAttribute('data-id', object._id);
    let deleteButton = document.createElement('button');
    deleteButton.className = 'delete-btn';
    deleteButton.textContent = 'Supprimer';
    deleteButton.setAttribute('data-id', object._id);
    li.appendChild(objectDiv);
    li.appendChild(modifyButton);
    li.appendChild(borrowButton);
    li.appendChild(deleteButton);
    availableList.appendChild(li);
  });
  availableDiv.appendChild(availableTitle);
  availableDiv.appendChild(availableList);

  // Affichage des objets empruntés
  let borrowedList = document.createElement('ul');
  borrowedList.className = 'borrowed-list';
  const borrowedTitle = document.createElement('h2');
  borrowedTitle.innerHTML = 'Emprunts en cours : ';
  borrowedObjectsList.forEach(object => {
    let li = document.createElement('li');
    li.className = 'borrowed-item';
    li.innerHTML = object.description;
    let returnButton = document.createElement('button');
    returnButton.className = 'return-btn';
    returnButton.textContent = 'Libérer';
    returnButton.setAttribute('data-id', object._id);
    li.appendChild(returnButton);
    borrowedList.appendChild(li);
  });
  borrowedDiv.appendChild(borrowedTitle);
  borrowedDiv.appendChild(borrowedList);

  const deleteBtns = document.querySelectorAll('.delete-btn');
  deleteBtns.forEach(button => {
    button.addEventListener('click', () => {
      const objectId = button.getAttribute('data-id');
      deleteObject(objectId, button);
    });
  });

  const nbBorrowed = borrowedObjectsList.length;
  const borrowBtns = document.querySelectorAll('.borrow-btn');
  borrowBtns.forEach(button => {
    button.addEventListener('click', async () => {
      const objectId = button.getAttribute('data-id');
      borrowObject(objectId, button);
    });
  });

  if (nbBorrowed === 0) { // si il n'y a aucun emprunt en cours
    const noBorrow = document.createElement('p');
    noBorrow.innerHTML = 'Vous n\'avez emprunté aucun objet.';
    borrowedDiv.appendChild(noBorrow);
  }

  // si l'utilisateur a atteint le nombre maximum d'emprunts autorisé
  if (nbBorrowed >= MAX_BORROW) {
    borrowBtns.forEach(button => button.remove());// on supprime tous les boutons "emprunter"
  }

  let nbAvailable = availableObjects.length;
  if (nbAvailable === 0) { // si il n'y a aucun objet disponibble en cours
    const noAvailable = document.createElement('p');
    noAvailable.innerHTML = `<p>Aucun objet disponible pour le moment.</p><p>Vous pouvez ajouter un objet en utilisant le formulaire ci-dessus.</p>`;
    availableDiv.appendChild(noAvailable);
  }

  const returnBtns = document.querySelectorAll('.return-btn');
  returnBtns.forEach(button => {
    button.addEventListener('click', () => {
      const objectId = button.getAttribute('data-id');
      returnObject(objectId, button);
    });
  });

  const modifyBtns = document.querySelectorAll('.modify-btn');
  modifyBtns.forEach(button => {
    button.addEventListener('click', () => {
      const objectId = button.getAttribute('data-id');
      updateDescription(objectId, button);
    });
  });

  displayObjectsOfOthers();
};

// borrows an object
const borrowObject = async (objectId, button) => {
  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const response = await fetch(`/object/borrow/${objectId}`, requestOptions);
  if (response.status === 400) {
    alert('Vous avez atteint la limite de deux objets empruntés. ');
    return;
  }
  const object = await response.json();
  // Pour construire le div avec les objets empruntés
  let ul = document.createElement('ul');
  ul.className = 'borrowed-list';
  let li = document.createElement('li');
  li.className = 'borrowed-item';
  li.innerHTML = object.description;
  let returnButton = document.createElement('button');
  returnButton.className = 'return-btn';
  returnButton.textContent = 'Libérer';
  returnButton.setAttribute('data-id', object._id);
  li.appendChild(returnButton);
  ul.appendChild(li);
  borrowedDiv.appendChild(ul);

  socket.emit('objectBorrowed', objectId);
};


// deletes an object
const deleteObject = async (objectId, button) => {
  const requestOptions = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const response = await fetch(`/object/${objectId}`, requestOptions);
  if (!response.ok) {
    throw new Error('Response not ok');
  }
  const deletedObject = await response.json();
  socket.emit('objectDeleted', objectId);
};

// returns an object
const returnObject = async (objectId, button) => {
  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const response = await fetch(`/object/return/${objectId}`, requestOptions);
  if (!response.ok) {
    throw new Error('Response not ok');
  }
  const object = await response.json();
  socket.emit('objectReturned', objectId);
};


// add a new object
const addNewObject = async () => {
  const description = document.getElementById('newObject').value;
  if (!description) {
    alert('La description ne peut pas être vide.');
    return;
  }
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({description: description})
  };
  const response = await fetch('/object/', requestOptions);
  if (!response.ok) {
    throw new Error('Response not ok');
  }
  const createdObject = await response.json();
  socket.emit('objectCreated', createdObject);
};


// displays objects of other users
const displayObjectsOfOthers = async () => {
  othersDiv.innerHTML = '';
  const requestOptions = {
    method: 'GET',
  };
  const response = await fetch('/object/others', requestOptions);
  const objectsOfOthers = await response.json();

  // Affichage des objets empruntés par les autres
  let borrowedByOtherList = document.createElement('ul');
  borrowedByOtherList.className = 'borrowed-by-others-list';
  const borrowedByOtherTitle = document.createElement('h2');
  borrowedByOtherTitle.innerHTML = 'Objets empruntés par d\'autres utilisateurs : ';
  objectsOfOthers.forEach(object => {
    let li = document.createElement('li');
    li.className = 'borrowed-by-others-item';
    li.innerHTML = `${object.description} emprunté(e) par`;
    let borrower = document.createElement('b');
    borrower.id = 'borrower';
    borrower.innerHTML = object.userName;
    li.appendChild(borrower);
    borrowedByOtherList.appendChild(li);
  });
  othersDiv.appendChild(borrowedByOtherTitle);
  othersDiv.appendChild(borrowedByOtherList);
  
  let nbBorrowedOfOthers = objectsOfOthers.length;
  if (nbBorrowedOfOthers === 0) { // si les autres n'ont aucun emprunt
    const noBorrowOfOther = document.createElement('p');
    noBorrowOfOther.innerHTML = `<p>Aucun objet n'a été emprunté par les autres utilisateurs pour le moment.</p><p>Soyez le premier à emprunter un objet !</p>`;
    othersDiv.appendChild(noBorrowOfOther);
  }
};


// updates the description of an object
const updateDescription = async (objectId, button) => {
  const newDescription = prompt('Veuillez saisir la nouvelle description de l\'objet :');
  if (!newDescription) {
    alert('La description ne peut pas être vide.');
    return;
  }
  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ objectId, newDescription })
  };
  const response = await fetch(`/object/update/${objectId}`, requestOptions);
  if (!response.ok) {
    throw new Error('Response not ok');
  }
  const updatedObject = await response.json();
  socket.emit("objectModified", updatedObject);
};


// displays the name and the id of the user
const getUser = async () => {
  const requestOptions = {
                           method :'GET',
                         };
  const response = await fetch('/user/me', requestOptions);
  if (response.ok) {
    const user = await response.json();
    userinfo.value = user.name + "    :    " + user.id || '';
    return user.id;
  }
  else {
    const error = await response.json();
    handleError(error);
  }
}


// responsible for logging out the user.
const logout = async () => {
    const requestOptions = {
                           method :'GET',
                         };
    const response = await fetch(`/access/logout`, requestOptions);
    if (response.ok) {
      window.location.href= '/';
    }
  }


// handles errors
const handleError = error => {
   if (error.redirectTo)
     window.location.href= error.redirectTo;
   else
     console.log(`erreur : ${error.message}`);
}