#!/usr/bin/env node
if(process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}

const {start} = require('../jobs/limitNotifier');
const {unwrapCypherResultToMap, unwrapCypherListNodeResult} = require('../../common/data/utils');
const logger = require('../../common/core/logger');
const {getAllPartialInvestments} = require('../../common/data/investmentRepository');
const {initDB, initRepositories} = require('../../common/data');
const send = require('../notifiers/email');

(async () => {
  try {
    const driver = await initDB();
    logger.info('Succesfully conected to the db');
    initRepositories(driver);

    start('GBP', unwrapCypherResultToMap, unwrapCypherListNodeResult, getAllPartialInvestments, send);
  }
  catch(error) {
    logger.error(error)
  }
})()
