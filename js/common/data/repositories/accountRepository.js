const {runQuery} = require('../query');

let DbDriver;

const init = driver => {
  DbDriver = driver;
}

const getSocialMediaRelationship = source =>
  source === 'fb'
    ? 'r:HAS_FB'
    : 'r:HAS_GOOGLE';

const getOrSaveSocialMediaAccount = async (source, authResponse) => {
  return await runQuery(
    DbDriver,
    `
      MERGE (u:User)-[${getSocialMediaRelationship(source)}]->(s:SocialMediaAccount {userId:{userId}, name:{name}, firsName:{firstName}, lastName:{lastName}, email:{email}, picture:{picture}})
      WITH u, s
      OPTIONAL MATCH (u)-[HAS_ROLE]->(r:Role)
      RETURN s{ .*, id: ID(u), roles: r.name}
    `,
    authResponse
  );
};

const createToken = async (source, account, generateToken) => {
  const token = generateToken(account);
  return await runQuery(
    DbDriver,
    `
    MATCH (u:User)-[${getSocialMediaRelationship(source)}]->(s:SocialMediaAccount {userId:"${account.get('userId')}"})
    MERGE (u)-[rt:HAS_TOKEN]->(t:AccessToken)
    ON CREATE SET t.created = timestamp(), t.value="${token}"
    ON MATCH SET t.updated = timestamp(), t.value="${token}"
    RETURN t.value
    `
  );
};

const getTokenAndCorrespondingAccounts = async token => {
  return await runQuery(
    DbDriver,
    `
      MATCH (u:User)-[rt:HAS_TOKEN]->(t:AccessToken {value:"${token}"}), (s: SocialMediaAccount)
      WHERE (u)-[:HAS_FB|:HAS_GOOGLE]->(s:SocialMediaAccount)
      RETURN t, s
    `
  );
};

const getAccount = async userId => {
  return await runQuery(
    DbDriver,
    `
      MATCH (u:User), (s: SocialMediaAccount)
      WHERE (u)-[:HAS_FB|:HAS_GOOGLE]->(s)
      RETURN s
    `
  );
}

module.exports = {
  init,
  getAccount,
  getOrSaveSocialMediaAccount,
  createToken,
  getTokenAndCorrespondingAccounts
}
