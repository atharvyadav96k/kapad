const express = require('express');
const party = express.Router();
const partyUtils = require('../utils/partyUtils');

party.get('/getParty', partyUtils.getPartys);

party.post('/create', partyUtils.create);

party.post('/edit', partyUtils.edit);

party.post('/delete', partyUtils.delete);

module.exports = party;