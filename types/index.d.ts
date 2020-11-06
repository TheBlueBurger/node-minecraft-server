
/*declare class minecraft_server {
  constructor(JSONOptions: OptionsInterface): minecraft_server;
  test: true
  
   //mabe hmm I dont remember how I did it last
}*/


export interface OptionsInterface {
  info_callback?: Function;
  ram?: number;
  port?: number;
  onlineMode?: boolean;
}
import * as MinecraftServer from '../index.js';

declare module 'minecraft_server' {
    class minecraft_server {
        // ...
        constructor(JSONOptions: OptionsInterface);
    }
}