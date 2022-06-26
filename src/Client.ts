import * as discord from 'discord.js';

import { ILogger, LogLevel } from 'betterjslogger';

export enum Deployment {
    DEVELOPMENT = 0,
    BETA,
    PRODUCTION,
}

export interface IClient {}

export interface customCallbacks {
    onReady: {
        override: boolean;
        run: (client: discord.Client<true>) => discord.Awaitable<void>;
    };
    onMessage: {
        override: boolean;
        run: Function;
    };
}

export interface clientOptions {
    token: string;
    prefixes: string | string[];

    customCallbacks?: customCallbacks;

    deployment: Deployment;
    version: string;

    clientOptions: discord.ClientOptions;
}

export class Client extends discord.Client implements IClient {
    private _deployment: Deployment | string = '';
    private _version: string = '';
    private _prefixes: string | string[] = '';

    private clientOptions: clientOptions;
    private logger: ILogger | undefined;

    constructor(options: clientOptions, logger?: ILogger) {
        super(options.clientOptions);

        this.clientOptions = options;
        this.logger = logger;

        this.prefixes;

        this.deployment = options.deployment;
        this.version = options.version;

        this.init();
    }

    public get deployment(): string | Deployment {
        switch (this._deployment) {
            case Deployment.DEVELOPMENT:
                return 'development';
            case Deployment.BETA:
                return 'beta';
            case Deployment.PRODUCTION:
                return 'production';
            default:
                return '';
        }
    }
    private set deployment(deployment: Deployment | string) {
        this._deployment = deployment;
    }

    public get version(): string {
        return this._version;
    }
    private set version(version: string) {
        this._version = version;
    }

    public get prefixes(): string | string[] {
        return this._prefixes;
    }
    private set prefixes(prefixes: string | string[]) {
        this._prefixes = prefixes;
    }

    private async init(): Promise<void> {
        if (this.clientOptions.customCallbacks?.onReady.override) {
            this.on('ready', this.clientOptions.customCallbacks?.onReady.run);
        } else {
            this.on('ready', async () => {
                if (this.logger) {
                    await this.logger.info('-------------------------------------------');
                    await this.logger.info(`Logged in as ${this.user?.tag}!`);
                    await this.logger.info(`Client id: ${this.user?.id}`);
                    await this.logger.info(`Deployment: ${this.deployment}`);
                    await this.logger.info(`Version: ${this.version}`);
                    await this.logger.info('-------------------------------------------');
                } else {
                    console.log('-------------------------------------------');
                    console.log(`Logged in as ${this.user?.tag}!`);
                    console.log(`Client id: ${this.user?.id}`);
                    console.log(`Deployment: ${this.deployment}`);
                    console.log(`Version: ${this.version}`);
                    console.log('-------------------------------------------');
                }

                this.user?.setActivity({
                    name: `${typeof this.prefixes == 'string' ? this.prefixes : this.prefixes[0]}`,
                    type: 'LISTENING',
                });
            });
        }
    }

    public async login(): Promise<string> {
        return await super.login(this.clientOptions.token);
    }
}
