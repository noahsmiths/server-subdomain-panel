import express from 'express';
import path from 'path';
import * as elements from 'typed-html';
import { CaddyHandler } from './types/CaddyHandler';

const app = express();
const port = 5555;

app.use('/', express.static(path.join(__dirname, '../frontend')));

app.get('/domains', async (req, res) => {
    let caddyResponse = await fetch(`http://${process.env.CADDY_HOSTNAME}:2019/config/apps/http/servers/https/routes`);
    let activeHandlers: CaddyHandler[] = await caddyResponse.json() as CaddyHandler[];

    res.send(
        <div>
            {
                activeHandlers.map((handler) => {
                    let path = handler.handle[0].routes[0].handle[0].upstreams[0].dial;
                    let domain = handler.match[0].host;

                    return (
                        <div>
                            { domain } - { path }
                        </div>
                    )
                })
            }
        </div>
    );
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});