const {contructCreateMatchString, contructUpdateMatchString, createMatchObj} = require('../utils');
const {runQuery} = require('../query');

let DbDriver;

const init = driver => {
  DbDriver = driver;
}

const getAssetTypes = async ({ctx}) => {
  const {skip=0, limit=1000000} = ctx.request.query;

  return  await runQuery(
    DbDriver,
    `
      MATCH (at:AssetType)
      RETURN at{ .*, id: ID(at)}
      ORDER BY at.name
      SKIP ${skip}
      LIMIT ${limit}
    `
  )
}

const createAssetType = async ({resource:assetType})  => {
  return await runQuery(
    DbDriver,
    `
      CREATE (at:AssetType ${contructCreateMatchString(assetType)})
      RETURN at{ .*, id: ID(at) }
    `,
    createMatchObj(assetType)
  );
}

const updateAssetType = async ({resource:assetType})  => {
  return  await runQuery(
    DbDriver,
    `
      MATCH (at:AssetType)
      WHERE ID(at) = ${assetType.id}
      SET at = ${contructCreateMatchString(assetType)}
      RETURN at
    `,
    createMatchObj(assetType)
  )
}

const deleteAssetType = async ({resource:assetTypeId})  => {
  return  await runQuery(
    DbDriver,
    `
      MATCH (at:AssetType)
      WHERE ID(at) = ${assetTypeId}
      DETACH DELETE at
    `
  )
}

module.exports = {
  init,
  getAssetTypes,
  createAssetType,
  updateAssetType,
  deleteAssetType
}

