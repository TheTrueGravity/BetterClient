import * as discord from 'discord.js'

export interface IClient {

}

export interface clientOptions {
    token: string
    prefix: string | string[]

    clientOptions: discord.ClientOptions
}

export class Client extends discord.Client implements IClient {
    private clientOptions: clientOptions

    constructor(options: clientOptions) {
        super(options.clientOptions)

        this.clientOptions = options
    }

    public async login(): Promise<string> {
        return await super.login(this.clientOptions.token)
    }
}