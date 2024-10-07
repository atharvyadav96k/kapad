const express = require('express');
const party = express.Router();
const partyUtils = require('../utils/partyUtils');

party.get('/get', partyUtils.getParty);

party.post('/create', partyUtils.create);

party.post('/edit/:id', partyUtils.edit);

party.post('/delete/:id', partyUtils.delete);

module.exports = party;