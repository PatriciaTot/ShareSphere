  /* retrieve the model : necessary to interact with the database */
  const Objects = require('../models/object.model').model;
  const User = require('../models/user.model').model;


  // controller for GET /
  const allObjects = async (_, res) => {
      try {
        const allObjects = await Objects.find();
        res.status(200).json(allObjects);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    };
      

  // controller for POST /
  const createObject = async (req, res, _) => {
    const newObjectData = { ...req.body };
    try {
      const createdObject = await Objects.create(newObjectData); 
      res.status(200).json(createdObject);
    } catch (error) {
      res.status(400).json(error);
      }
    };

  // Controller for DELETE /id
  const deleteObject = async (req, res) => {
    const objectId = req.params.id;
    try {
      const deletedObject = await Objects.findByIdAndDelete(objectId);
      res.status(200).json(deletedObject);
    } catch (error) {
        res.status(500).json(error);
      }
    };

    // Controller for PUT /borrow/objectId
    const borrowObject = async (req, res) => {
      try {
        const objectId = req.params.objectId;
        const borrower = await User.findById(req.userId);

        if (borrower.borrowedObjects.length === 2) {
          res.status(400).json({ message: "Vous avez emprunté 2 objets" });
          return;
        }

        const updatedObject = await Objects.findByIdAndUpdate(objectId, {
          isBorrowed: true,
          borrower: borrower
        }, { new: true });
    
        if (!updatedObject) {
          throw new Error('Object not found');
        }
    
        borrower.borrowedObjects.push(updatedObject._id);
        await borrower.save();
        res.status(200).json(updatedObject);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };

    // Controller for PUT /return/objectId
    const returnObject = async (req, res) => {
      try {
        const objectId = req.params.objectId;
        const borrower = await User.findById(req.userId);
        const updatedObject = await Objects.findByIdAndUpdate(objectId, {
          isBorrowed: false,
          borrower: null
        }, { new: true });
    
        if (!updatedObject) {
          res.status(404).json({ error: 'Object not found' });
        }
    
        borrower.borrowedObjects.pull(updatedObject._id);
        await borrower.save(); 
        res.status(200).json(updatedObject);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };

    // Controller for GET /others
    const objectsOfOthers = async (req, res) => {
      const objectsOfOthers = await Objects.find({isBorrowed:true, borrower:{ $ne: req.userId }}).populate('borrower');
      const objectsAndUsersNames = objectsOfOthers.map(object => {
        return {
          description: object.description,
          userName: object.borrower.name
        }
      });
      res.status(200).json(objectsAndUsersNames);
    }

    // Controller for PUT /update/objectId
    const updateObjectDescription = async (req, res) => {
      const { objectId, newDescription } = req.body;
      try {
        const object = await Objects.findById(objectId);
        if (!object) {
          res.status(404).json({ message: 'Object not found' });
          return;
        }
        object.description = newDescription;
        const updatedObject = await object.save();
        res.status(200).json(updatedObject);
      } catch (error) {
        res.status(400).json(error);
      }
    };


module.exports.allObjects = allObjects;
module.exports.createObject = createObject;
module.exports.deleteObject = deleteObject;
module.exports.borrowObject = borrowObject;
module.exports.returnObject = returnObject;
module.exports.objectsOfOthers = objectsOfOthers;
module.exports.updateObjectDescription = updateObjectDescription;