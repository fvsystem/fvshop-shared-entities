import { config as readEnv } from 'dotenv';
import { join } from 'path';

export type ConfigShared = {
  db: {
    vendor: any;
    host: string;
    logging: boolean;
  };
};

export function makeConfigShared(envFile): ConfigShared {
  const output = readEnv({ path: envFile });

  return {
    db: {
      vendor: output.parsed.DB_VENDOR as any,
      host: output.parsed.DB_HOST,
      logging: output.parsed.DB_LOGGING === 'true',
    },
  };
}

// export const config = makeConfig(envFile);

const envTestingFile = join(__dirname, '../../../.env.test');
export const configTest = makeConfigShared(envTestingFile);
