import { ConsoleLogger } from '@nestjs/common';
import * as path from "path"
import * as fs from "fs"
import * as uuid from "uuid"

export class Logger extends ConsoleLogger {
    error(message: any, stack?: string, context?: string) {
        // add your tailored logic here
        super.error(message, stack, context);
    }
}
