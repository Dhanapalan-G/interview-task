// logging.middleware.ts
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor() {}

  private readonly logger = new Logger('HTTP');

  use(req: any, res: any, next: () => void) {
    const { method, baseUrl, body, url } = req;
    // Capture response status and log it after the request is processed
    res.on('finish', () => {
      const { statusCode } = res;
      this.logger.log(
        ` "${method} ${baseUrl} [Status:${statusCode}]"
        Params: ${url}
        Body: ${JSON.stringify(body)} `,
      );
    });
    next();
  }
}
