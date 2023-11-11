import * as yo from './yo-sdk'

export type ServerChannel = {
    name: string,
    readOnly: boolean,
}

export type ServerImpl = {
    channels: () => Promise<ServerChannel[]>,
}

export function newTwitch(): ServerImpl {
    throw ('TODO')
}

export function newKaffe(): ServerImpl {
    const ret: ServerImpl = {
        channels: async (): Promise<ServerChannel[]> => {
            const ret: ServerChannel[] = [{
                name: "(all buddies)",
                readOnly: false,
            }]
            const buddies = (await yo.api__userBuddies({})).Buddies
            for (const buddy of buddies)
                ret.push({ name: buddy.Nick!, readOnly: false })
            return ret
        }
    }
    return ret
}
