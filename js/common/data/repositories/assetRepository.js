const {contructCreateMatchString, contructUpdateMatchString, createMatchObj} = require('../utils');
const {runQuery} = require('../query');

let DbDriver;

const init = driver => {
  DbDriver = driver;
}

const getAsset = async ({ctx}) => {
  const {skip=0, limit=1000000} = ctx.request.query;

  return  await runQuery(
    DbDriver,
    `
      MATCH (at:Asset)
      RETURN at{ .*, id: ID(at)}
      ORDER BY at.name
      SKIP ${skip}
      LIMIT ${limit}
    `
  )
}

const createAsset = async ({resource:asset})  => {
  return await runQuery(
    DbDriver,
    `
      CREATE (at:Asset ${contructCreateMatchString(asset)})
      RETURN at{ .*, id: ID(at) }
    `,
    createMatchObj(asset)
  );
}

const updateAsset = async ({resource:asset})  => {
  return  await runQuery(
    DbDriver,
    `
      MATCH (at:Asset)
      WHERE ID(at) = ${asset.id}
      SET at = ${contructCreateMatchString(asset)}
      RETURN at
    `,
    createMatchObj(asset)
  )
}

const deleteAsset = async ({resource:assetId})  => {
  return  await runQuery(
    DbDriver,
    `
      MATCH (at:Asset)
      WHERE ID(at) = ${assetId}
      DETACH DELETE at
    `
  )
}

module.exports = {
  init,
  getAsset,
  createAsset,
  updateAsset,
  deleteAsset
}

