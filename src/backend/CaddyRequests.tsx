import * as elements from 'typed-html';
import { CaddyHandler } from "./types/CaddyHandler";

export async function getAllDomains() {
    let caddyResponse = await fetch(`http://${process.env.CADDY_HOSTNAME}:2019/config/apps/http/servers/https/routes`);
    let activeHandlers: CaddyHandler[] = await caddyResponse.json() as CaddyHandler[];

    return (
        <tbody>
            {
                activeHandlers.map((handler, index) => {
                    let dial = handler.handle[0].routes[0].handle[0].upstreams[0].dial;
                    let port = dial.substring(dial.indexOf(':') + 1);
                    let domain = handler.match[0].host[0];

                    return (
                        <tr>
                            <td>{ domain }</td>
                            <td>{ port }</td>
                            <td><button hx-delete={`/domains/${index}`} hx-target="closest tbody" hx-swap="outerHTML" class="underline">Delete</button></td>
                        </tr>
                    )
                })
            }
        </tbody>
    );
}