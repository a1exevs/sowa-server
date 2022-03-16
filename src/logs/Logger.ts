import { ConsoleLogger } from '@nestjs/common';
import * as path from "path"
import * as fs from "fs"

export class Logger extends ConsoleLogger {
    error(message: any, stack?: string, context?: string) {
        super.error(message, stack, context);
        Logger.logToFile(message, stack, context);
    }

    private static logToFile(message: any, stack?: string, context?: string)
    {
        const date = new Date();
        const year = date.getFullYear()
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const logDir = path.resolve(__dirname) + `/${year}/${month}/`;
        if(!fs.existsSync(logDir))
            fs.mkdirSync(logDir, { recursive: true })

        const data = `[YYYY/MM/DD HH:MM:SS][${year}/${month}/${day} ${date.toLocaleTimeString()}]\n[${message}]\n[${stack}]\n[${context}]\n\n`;
        fs.appendFile(logDir + `${day}.ts`, data, "utf-8", (err) => {
            if (err) return;
        })
    }
}
