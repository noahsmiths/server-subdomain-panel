export interface CaddyHandler {
    handle: {
        handler: string,
        routes: {
            handle: {
                handler: string,
                transport?: any
                upstreams: {
                    dial: string
                }[]
            }[]
        }[]
    }[],
    match: {
        host: string
    }[],
    terminal: boolean
}
