import { Injectable, Scope, Logger } from '@nestjs/common';

   @Injectable({ scope: Scope.TRANSIENT })
   export class LoggingService extends Logger {
    setContext(_context: string) {
      }
     log(message: string, context?: string) {
       super.log(`[LOG] ${message}`, context);
     }

     error(message: string, trace?: string, context?: string) {
       super.error(`[ERROR] ${message}`, trace, context);
     }

     warn(message: string, context?: string) {
       super.warn(`[WARN] ${message}`, context);
     }

     debug(message: string, context?: string) {
       super.debug(`[DEBUG] ${message}`, context);
     }

     verbose(message: string, context?: string) {
       super.verbose(`[VERBOSE] ${message}`, context);
     }
   }