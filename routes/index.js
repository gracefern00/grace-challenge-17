const router = require('express').Router();
const userRoutes = require('./userRoutes');
const thoughtRoutes = require('./thoughtRoutes');

router.use('/users', userRoutes);
router.use('/thoughts', thoughtRoutes);

module.exports = router;
// This code sets up the main API routes for the application. It imports the userRoutes and thoughtRoutes modules and uses them for handling requests to the '/users' and '/thoughts' endpoints, respectively. The router is then exported for use in other parts of the application.

