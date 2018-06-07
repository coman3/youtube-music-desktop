import * as fs from "fs";

// tslint:disable-next-line:no-var-requires
const requiredInject = require("./inject");
export default function resolve(): Promise<string> {
    return new Promise<string>((resolver, rejector) => {
        fs.readFile(__dirname + "/" + "inject.js", "utf8", (err, data) => {
            if (err != null) return rejector(err);
            return resolver(data);
        });        
    });
}
