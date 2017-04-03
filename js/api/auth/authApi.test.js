const test = require('ava');
const sinon = require('sinon');
const Maybe = require('folktale/data/maybe');
const {login} = require('./authApi');

test.beforeEach(t => {
  t.context.ctx = {
    header: {
      'x-auth-source': 'fb',
      'x-auth-token': 'fb_token'
    },
    request: {
      body:'fb_auth_response'
    }
  };
  t.context.next = sinon.spy();
  t.context.checkAccessToken = () => Promise.resolve('');
  t.context.getOrSaveSocialMediaAccount = () => Promise.resolve('');
  t.context.createToken = () => Promise.resolve('access_token');
  t.context.unwrapCypherResult = () => Promise.resolve('');
});

test('login should call checkAccessToken', async t => {
  const {getOrSaveSocialMediaAccount, createToken, unwrapCypherResult, ctx, next} = t.context;
  const checkAccessToken = sinon.spy();
  await login(checkAccessToken, getOrSaveSocialMediaAccount, createToken, unwrapCypherResult, ctx, next);
  t.truthy(checkAccessToken.called);
  t.truthy(checkAccessToken.calledWith('fb', 'fb_token', 'fb_auth_response'));
});

test('login should call set 403 if checkAccessToken raised an error', async t => {
  const {getOrSaveSocialMediaAccount, createToken, unwrapCypherResult, ctx, next} = t.context;
  const checkAccessToken = Promise.reject()
  await login(checkAccessToken, getOrSaveSocialMediaAccount, createToken, unwrapCypherResult, ctx, next);

  t.deepEqual(ctx.body, {status: 403, message: { error: 'Access Denied' }});
});

test('login should call getOrSaveSocialMediaAccount', async t => {
  const {checkAccessToken, createToken, unwrapCypherResult, ctx, next} = t.context;
  const getOrSaveSocialMediaAccount = sinon.spy();

  await login(checkAccessToken, getOrSaveSocialMediaAccount, createToken, unwrapCypherResult, ctx, next);
  t.truthy(getOrSaveSocialMediaAccount.called);
  t.truthy(getOrSaveSocialMediaAccount.calledWith('fb', 'fb_auth_response'));
});

test('login should call set 403 if getOrSaveSocialMediaAccount raised an error', async t => {
  const {checkAccessToken, createToken, unwrapCypherResult, ctx, next} = t.context;
  const getOrSaveSocialMediaAccount = Promise.reject()
  await login(checkAccessToken, getOrSaveSocialMediaAccount, createToken, unwrapCypherResult, ctx, next);

  t.deepEqual(ctx.body, {status: 403, message: { error: 'Access Denied' }});
});

test('login should call unwrap the result from the creating a new account and then call createToken', async t => {
  const {checkAccessToken, getOrSaveSocialMediaAccount, ctx, next} = t.context;
  const unwrapCypherResult = () => Maybe.Just(['account']);
  const createToken = sinon.spy();

  await login(checkAccessToken, getOrSaveSocialMediaAccount, createToken, unwrapCypherResult, ctx, next);
  t.truthy(createToken.called);
  t.truthy(createToken.calledWith('fb', 'account'));
});

test('login should return a new access token to the client', async t => {
  const {checkAccessToken, getOrSaveSocialMediaAccount, createToken, ctx, next} = t.context;
  const unwrapCypherResult = () => Maybe.Just(['access_token']);
  await login(checkAccessToken, getOrSaveSocialMediaAccount, createToken, unwrapCypherResult, ctx, next);
  t.deepEqual(ctx.body, {token: 'access_token'});
});

test.only('login should return 403 if createToken failed', async t => {
  const {checkAccessToken, getOrSaveSocialMediaAccount, createToken, ctx, next} = t.context;
  let unwrapCypherResult = () => {
    unwrapCypherResult = Maybe.Nothing();
    return Maybe.Just();
  };

  await login(checkAccessToken, getOrSaveSocialMediaAccount, createToken, unwrapCypherResult, ctx, next);
  t.deepEqual(ctx.body, {status: 403, message: { error: 'Access Denied' }})
});
