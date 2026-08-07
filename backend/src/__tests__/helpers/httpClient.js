import request from 'supertest';
import app from '../../app.js';

export const API_PREFIX = '/api/v1';

export function http() {
  return request(app);
}

export async function loginRequest(email, password) {
  return http().post(`${API_PREFIX}/auth/login`).send({ email, password });
}

export async function loginAs(email, password) {
  const res = await loginRequest(email, password);
  return {
    response: res,
    accessToken: res.body?.data?.accessToken,
    refreshToken: res.body?.data?.refreshToken,
    user: res.body?.data?.user,
  };
}

function withOptionalAuth(token, req) {
  if (token) {
    req.set('Authorization', `Bearer ${token}`);
  }
  return req;
}

export function authGet(token, path) {
  return withOptionalAuth(token, http().get(`${API_PREFIX}${path}`));
}

export function authPost(token, path, body = {}) {
  return withOptionalAuth(token, http().post(`${API_PREFIX}${path}`)).send(body);
}

export function authPut(token, path, body = {}) {
  return withOptionalAuth(token, http().put(`${API_PREFIX}${path}`)).send(body);
}

export function authPatch(token, path, body = {}) {
  return withOptionalAuth(token, http().patch(`${API_PREFIX}${path}`)).send(body);
}

export function authDelete(token, path) {
  return withOptionalAuth(token, http().delete(`${API_PREFIX}${path}`));
}

export function publicPost(path, body = {}) {
  return http().post(`${API_PREFIX}${path}`).send(body);
}

export function publicPut(token, path, body = {}) {
  return withOptionalAuth(token, http().put(`${API_PREFIX}${path}`)).send(body);
}
