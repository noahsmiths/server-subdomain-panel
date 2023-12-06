import express from 'express';
import path from 'path';
import * as elements from 'typed-html';
import { CaddyHandler } from './types/CaddyHandler';
import { getAllDomains } from './CaddyRequests';

const app = express();
const port = 5555;

app.use(express.urlencoded({extended: true}));
app.use('/', express.static(path.join(__dirname, '../frontend')));

app.get('/domains', async (req, res) => {
    let domains = await getAllDomains();

    res.send(domains);
});

app.post('/domains', async (req, res) => {
    let domain: string = req.body.domain;
    let port: string = req.body.port;

    if (!domain || !port) {
        res.status(400);
        return;
    }

    if (parseInt(port) <= 500) {
        res.status(400).send('Port must be above 500.');
        return;
    }

    let domainHandler: CaddyHandler = {
        handle: [
            {
                handler: 'subroute',
                routes: [
                    {
                        handle: [
                            {
                                handler: 'reverse_proxy',
                                upstreams: [
                                    {
                                        dial: `127.0.0.1:${port}`
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        match: [{ host: [domain] }],
        terminal: true
    }

    let caddyResponse = await fetch(`http://${process.env.CADDY_HOSTNAME}:2019/config/apps/http/servers/https/routes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(domainHandler)
    });

    if (caddyResponse.status !== 200) {
        res.status(503).send(await caddyResponse.json());
        return;
    }

    let domains = await getAllDomains();

    res.send(domains);
});

app.delete('/domains/:index', async (req, res) => {
    let index = parseInt(req.params.index);

    if (!Number.isInteger(index)) {
        res.status(400).send("Index must be an integer. ex: /delete/1");
        return;
    }

    let caddyResponse = await fetch(`http://${process.env.CADDY_HOSTNAME}:2019/config/apps/http/servers/https/routes/${index}`, {
        method: 'DELETE'
    });

    if (caddyResponse.status !== 200) {
        res.status(503).send(await caddyResponse.json());
        return;
    }

    // Must requery all domains as deleting an index will shift all others above it
    let domains = await getAllDomains();
    
    res.send(domains);
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});