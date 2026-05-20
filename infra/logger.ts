import pino from 'pino';
import environment from '@/models/environment';

const logger = pino({
  level: environment.isDevEnvironment() ? 'debug' : 'info',
  transport: environment.isDevEnvironment()
    ? { target: 'pino-pretty', options: { colorize: true } }
    : undefined,
});
export default logger;
