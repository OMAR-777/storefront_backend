import app from './app';
import { checkingEnvVariables } from './config/checking-env-variables';
import { startDbConnection } from './config/sequelize';
import Logger from './src/middlewares/logger';

const start = async () => {
  checkingEnvVariables();
  await startDbConnection();

  const port = process.env.NODE_PORT;
  app.listen(port, () => Logger.info('Listening on port 3000!'));
};

start();
