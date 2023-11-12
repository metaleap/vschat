import * as util from './util.js'
import * as yo from './yo-sdk.js'
import * as youtil from './yo-util.js'


export type ServerImpl = {
    title: string
    curChannelId: number
    channels: ServerChannel[]
    logIn: () => void
    loadChannelsList: () => void
}

export type ServerChannel = {
    id: number
    title: string
    readOnly: boolean
    posts: ChannelPost[]
    pollingPaused: boolean
    pollingStart: () => void
    onFreshPosts: (() => void) | null
}

export type ChannelPost = {
    id: number
}

export function newTwitch(): ServerImpl {
    throw ('TODO')
}

export async function newKaffe(): Promise<ServerImpl> {
    const fetch = (await import('node-fetch')) as any
    const cookie = (await import('fetch-cookie')) as any
    const fetch_with_cookies = cookie(fetch, new cookie.toughCookie.CookieJar(undefined, {
        allowSpecialUseDomain: true,
        rejectPublicSuffixes: false,
        looseMode: true,
        prefixSecurity: 'unsafe-disabled',
    }), false)
    yo.setCustomFetch((reqUrl: string, reqInit?: object): Promise<Response> => {
        return (fetch_with_cookies(reqUrl, reqInit) as any) as Promise<Response>
    })
    const host = 'kaffe.up.railway.app'
    yo.setApiBaseUrl('https://' + host)
    let ret_impl: ServerImpl
    let next_since: string | undefined = undefined
    const do_poll_now = async () => {
        const channel = ret_impl.channels.find(_ => (_.id === ret_impl.curChannelId))!
        if (channel.pollingPaused)
            return
        try {
            const results = await yo.api__postsRecent({
                OnlyBy: (ret_impl.curChannelId ? [ret_impl.curChannelId] : []),
                Since: next_since,
            })
            if (channel.pollingPaused)
                return
            next_since = results.NextSince
            let fresh_posts: ChannelPost[] = results.Posts.map(_ => {
                return { id: _.Id! }
            })
            for (const old_post of channel.posts)
                if (!fresh_posts.some(_ => (_.id === old_post.id)))
                    fresh_posts.push(old_post)
            if (!youtil.deepEq(fresh_posts, channel.posts)) {
                channel.posts = fresh_posts
                if (channel.onFreshPosts)
                    channel.onFreshPosts()
            }
        } catch (err) {
            if (!channel.pollingPaused)
                util.alert(youtil.errStr(err))
        }

        if (!channel.pollingPaused)
            setTimeout(do_poll_now, 4321)
    }

    ret_impl = {
        title: host,
        curChannelId: 0,
        channels: [],
        logIn: async () => {
            try {
                await yo.api__userSignInOrReset({ NickOrEmailAddr: "dummy@metaleap.net", PasswordPlain: "foobar" })
            } catch (err) {
                util.alert(youtil.errStr(err))
            }
        },
        loadChannelsList: async () => {
            ret_impl.channels = [{
                id: 0,
                title: "(all buddies)",
                readOnly: false,
                posts: [],
                pollingPaused: true,
                onFreshPosts: null,
                pollingStart: async () => { ret_impl.curChannelId = 0; do_poll_now(); },
            }]
            try {
                const buddies = (await yo.api__userBuddies({})).Buddies
                for (const buddy of buddies)
                    ret_impl.channels.push({
                        id: 0,
                        title: buddy.Nick!,
                        readOnly: false,
                        posts: [],
                        pollingPaused: true,
                        onFreshPosts: null,
                        pollingStart: async () => { ret_impl.curChannelId = buddy.Id!; do_poll_now() },
                    })
            } catch (err: any) {
                util.alert(youtil.errStr(err))
            }
        },
    }
    return ret_impl
}
