const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authentication.middleware');
const objectController = require('../controllers/object.controller');

router.get('/', authMiddleware.validToken, objectController.allObjects);

router.post('/', authMiddleware.validToken, objectController.createObject);

router.delete('/:id', authMiddleware.validToken, objectController.deleteObject);

router.put('/borrow/:objectId', authMiddleware.validToken, objectController.borrowObject);

router.put('/return/:objectId', authMiddleware.validToken, objectController.returnObject);

router.get('/others', authMiddleware.validToken, objectController.objectsOfOthers);

router.put('/update/:objectId', authMiddleware.validToken, objectController.updateObjectDescription);

module.exports = router;
