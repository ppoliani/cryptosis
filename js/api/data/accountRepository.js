const {runQuery} = require('./query');
const {generateToken} = require('../auth/jwt');

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

const createToken = async (source, account) => {
  const token = generateToken(account);
  return await runQuery(
    DbDriver,
    `
    MATCH (u:User)-[${getSocialMediaRelationship(source)}]->(s:SocialMediaAccount {userId:"${account.userId}"})
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

module.exports = {init, getOrSaveSocialMediaAccount, createToken, getTokenAndCorrespondingAccounts}
