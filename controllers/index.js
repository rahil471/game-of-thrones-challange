var express = require('express')
  , router = express.Router();
  
router.use('/battle', require('./battle'));
  
module.exports = router;