import { minecraft_server } from "minecraft_server";

/*declare class minecraft_server {
  constructor(JSONOptions: OptionsInterface): minecraft_server;
  test: true
  
   //mabe hmm I dont remember how I did it last
}*/

declare namespace minecraft_server {
  class minecraft_server {
    constructor(JSONOptions: OptionsInterface): minecraft_server;
    test: true
  }
}

declare interface OptionsInterface {
  info_callback?: Function;
  ram?: number;
  port?: number;
  onlineMode?: boolean;
}