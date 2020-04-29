const { expect } = require('chai');
const supertest = require('supertest');
require('dotenv').config();


global.expect = expect;
global.supertest = supertest;