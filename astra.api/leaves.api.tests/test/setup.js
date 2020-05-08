//setting requirements that will be needed for app.spec.js

const { expect } = require('chai');
const supertest = require('supertest');

global.expect = expect;
global.supertest = supertest;