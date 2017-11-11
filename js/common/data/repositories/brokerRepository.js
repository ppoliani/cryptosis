const {contructCreateMatchString, contructUpdateMatchString, createMatchObj} = require('../utils');
const {runQuery} = require('../query');

let DbDriver;

const init = driver => {
  DbDriver = driver;
} 

const getBrokers = async ({ctx}) => {
  const {skip=0, limit=1000000} = ctx.request.query; 

  return  await runQuery( 
    DbDriver,
    `
      MATCH (b:Broker)
      RETURN b{ .*, id: ID(b) }
      ORDER BY b.name
      SKIP ${skip}
      LIMIT ${limit}
    `
  )
}

const createBroker = async ({resource:broker}) => {
  return  await runQuery(
    DbDriver,
    `
      CREATE (b:Broker ${contructCreateMatchString(broker)})
      RETURN b{ .*, id: ID(b) }
    `,
    createMatchObj(broker)
  )
}

const updateBroker = async ({resource:broker}) => {
  return  await runQuery(
    DbDriver,
    `
      MATCH (b:Broker)
      WHERE ID(b) = ${broker.id}
      SET b = ${contructUpdateMatchString(broker)}
      RETURN b
    `,
    createMatchObj(broker)
  )
}

const deleteBroker = async ({resource:brokerId}) => {
  return  await runQuery(
    DbDriver,
    `
      MATCH (b:Broker)
      WHERE ID(b) = ${brokerId}
      DETACH DELETE b
    `
  )
}

module.exports = {
  init,
  getBrokers,
  createBroker,
  updateBroker,
  deleteBroker
};

