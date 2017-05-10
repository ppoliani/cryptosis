const {contructCreateMatchString, contructUpdateMatchString, createMatchObj} = require('./utils');
const {runQuery} = require('./query');

let DbDriver;

const init = driver => {
  DbDriver = driver;
}

const saveBroker = async broker => {
  return  await runQuery(
    DbDriver,
    `
      CREATE (b:Broker ${contructCreateMatchString(broker)})
      RETURN b{ .*, id: ID(b) }
    `,
    createMatchObj(broker)
  )
}

const updateBroker = async broker => {
  return  await runQuery(
    DbDriver,
    `
      MATCH (b:Broker)
      WHERE ID(b) = ${broker.id}
      SET b = ${contructUpdateMatchString(broker)}
      RETURN b{ .*, id: ID(b) }
    `,
    createMatchObj(broker)
  )
}

const deleteBroker = async brokerId => {
  return  await runQuery(
    DbDriver,
    `
      MATCH (b:Broker)
      WHERE ID(b) = ${brokerId}
      DETACH DELETE b
    `
  )
}

module.exports = {init, saveBroker, updateBroker, deleteBroker};

