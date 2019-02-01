import path from "path";
import glob from "glob";
import * as load from "load-json-file";
import * as write from "write-json-file";
import { Dataset, Blockchains, Token } from "../data"

const data: Blockchains = {
    eos: {
        exchanges: {
            cex: [],
            dex: [],
        },
        dapps: {
            account: [],
            collectibles: [],
            gambling: [],
            games: [],
            marketplaces: [],
            namebid: [],
            resources: [],
            social: [],
            candy: [],
        },
        system: {
            blacklist: [],
            ibc: [],
            bpay: [],
            vpay: [],
            eosio: [],
            genesis: [],
            names: [],
            ram: [],
            stake: [],
        },
        tokens: [],
    }
};

// EOS System
for (const filepath of glob.sync(path.join(__dirname, "..", "json", "eos", "system", "*.json"))) {
    const {name} = path.parse(filepath);

    const dataset = load.sync<Dataset>(filepath);
    data.eos.system[name] = dataset;
}

// EOS Dapps
for (const filepath of glob.sync(path.join(__dirname, "..", "json", "eos", "dapps", "**", "*.json"))) {
    const dataset = load.sync<Dataset>(filepath);
    const sub = path.parse(filepath.split(path.join("json", "eos", "dapps"))[1]);
    const name = path.parse(sub.dir).name;

    if (!data.eos.dapps[name]) data.eos.dapps[name] = [];
    for (const row of dataset) {
        data.eos.dapps[name].push(row);
    }
}

// EOS Exchanges
for (const filepath of glob.sync(path.join(__dirname, "..", "json", "eos", "exchanges", "**", "*.json"))) {
    const dataset = load.sync<Dataset>(filepath);
    const sub = path.parse(filepath.split(path.join("json", "eos", "exchanges"))[1]);
    const name = path.parse(sub.dir).name;

    if (!data.eos.exchanges[name]) data.eos.exchanges[name] = [];
    for (const row of dataset) {
        data.eos.exchanges[name].push(row);
    }
}

// EOS Tokens
for (const filepath of glob.sync(path.join(__dirname, "..", "json", "eos", "tokens", "*.json"))) {
    const token = load.sync<Token>(filepath);
    data.eos.tokens.push(token);
}

write.sync(path.join(__dirname, "..", "data.json"), data);