export interface CaddyHandler {
    handle: Array<{
        handler: string,
        routes: Array<{
            handle: Array<{
                handler: string,
                transport?: any
                upstreams: Array<{
                    dial: string
                }>
            }>
        }>
    }>,
    match: Array<{
        host: Array<string>
    }>,
    terminal: boolean
}
