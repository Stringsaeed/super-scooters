import * as cors from "cors";
import * as helmet from "helmet";
import * as logger from "morgan";
import * as express from "express";
import { Application } from "express";
import * as cookieParser from "cookie-parser";
import { ApolloServer } from "apollo-server-express";

import { IApp } from "./interfaces";
import { createContext, schema } from "./graphql";

class App implements IApp {
  public port: number | string;
  public app: Application;
  public env: boolean;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 5000;
    this.env = process.env.NODE_ENV === "production";

    this.initializeDB();
    this.initializeMiddlewares();
    this.initializeGraphql();
  }

  public async initializeDB() {}

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`🚀 App listening on the port ${this.port}`);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    if (this.env) {
      this.app.use(helmet());
      this.app.use(logger("combined"));
      this.app.use(cors({ origin: "your.domain.com", credentials: true }));
    } else {
      this.app.use(logger("dev"));
      this.app.use(cors({ origin: true, credentials: true }));
    }
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeGraphql() {
    const server = new ApolloServer({
      schema,
      context: createContext,
    });
    server.applyMiddleware({ app: this.app });
  }
}

export default App;
