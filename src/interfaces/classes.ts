import { Application } from "express";
import Route from "./routers";

export interface IApp {
  app: Application;
  port: string | number;
  env: boolean;
  initializeDB: () => Promise<void>;
  listen: () => void;
  getServer: () => Application;
}
