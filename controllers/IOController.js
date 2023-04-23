class IOController {

    #io;

    constructor(io) {
      this.#io = io;
    }

    // gère les connexions et les événements de sockets
    registerSocket(socket) {
      console.log(`socket ${socket.id} connected`);
      socket.on('disconnect', () => {
        console.log(`socket ${socket.id} disconnected`);
      });

      socket.on('objectCreated', (objectId) => this.emitObjectCreated(socket, objectId));
      socket.on('objectDeleted', (objectId) => this.emitObjectDeleted(socket, objectId));
      socket.on('objectBorrowed', (objectId) => this.emitObjectBorrowed(socket, objectId));
      socket.on('objectReturned', (objectId) => this.emitObjectReturned(socket, objectId));
      socket.on('objectModified', (objectId) => this.emitObjectModified(socket, objectId));
    }

    // méthodes pour émettre les événements à tous les clients connectés
  
    emitObjectCreated(socket, objectId) {
        this.#io.emit('objectCreated', objectId);
    }

    emitObjectDeleted(socket, objectId) {
      this.#io.emit('objectDeleted', objectId);
    }
    
    emitObjectBorrowed(socket, objectId) {
      this.#io.emit('objectBorrowed', objectId);
    }

    emitObjectReturned(socket, objectId) {
      this.#io.emit('objectReturned', objectId);
    }

    emitObjectModified(socket, objectId) {
      this.#io.emit('objectModified', objectId);
    }

  }

  module.exports = IOController;