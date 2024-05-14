import 'module-alias';
import express, { Application, Request, Response } from 'express';
import 'colors';
import morgan from 'morgan';
import cors from 'cors';
import Controller from './shared/types/controllers.types';
import { errorHandler } from './shared/middlewares/error.middleware';

class App {
  app: Application;
  constructor(controllers: Controller[]) {
    this.app = express();
    this.initializeMiddlewares();
    this.initControllers(controllers);
  }

  private initControllers(controllers: Controller[]): void {
    controllers.forEach(async (controller: Controller) => {
      this.app.use('/api/v1', controller.router);
    });
  }
  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(morgan('dev'));
    this.app.use(errorHandler);
    this.app.use(cors());
    this.app.get('/api/v1', (req: Request, res: Response) => {
      res.status(200).json({
        message: 'Server Running',
        status: 'success',
        processId: process.pid,
      });
    });
  }
}

export default App;
