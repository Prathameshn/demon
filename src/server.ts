import { Request, Response } from 'express';

const Express = require('express');
const app = Express();
require('dotenv').config();
export const router = Express.Router();

const bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

import { AppLog } from "./config/log.config";
app.get('/', (req: Request, res: Response) => {
  res.status(200).send({ msg: 'server is working !!!!!' });
});

import { authorization } from "./utill/auth.middleware";
app.use(authorization);

app.use(Express.static('public'))

app.use('/service', require('./route/api/user.api'));
app.use('/feed',require('./route/api/feed.route'))

app.listen(process.env.PORT || 5000, (err: any) => {

  AppLog.error('Error occured while starting the server '+ err);
  if (err) console.log('Error occured while starting the server');

  AppLog.info(`server is running on port ${process.env.PORT}`);
  console.log(`server is running on port ${process.env.PORT}`);
});

module.exports = app;
