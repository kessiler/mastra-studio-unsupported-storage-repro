import { Mastra } from '@mastra/core';
import { LibSQLStore } from '@mastra/libsql';
import { DefaultExporter, Observability } from '@mastra/observability';

export const mastra = new Mastra({
  server: { port: 4199, host: '127.0.0.1' },
  storage: new LibSQLStore({ id: 'reproduction', url: ':memory:' }),
  observability: new Observability({
    configs: {
      default: {
        serviceName: 'unsupported-storage-reproduction',
        exporters: [new DefaultExporter()],
      },
    },
  }),
});
