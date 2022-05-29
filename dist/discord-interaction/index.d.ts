import { Client, Collection, ClientOptions } from "discord.js";
import Command from './commands/CommandInterface';
declare class tsClient extends Client {
    constructor(options: ClientOptions);
    commands?: Collection<string, Command>;
}
export declare const client: tsClient;
export {};
