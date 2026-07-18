import { rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const databasePath = join(tmpdir(), `efh-api-e2e-${process.pid}.sqlite`);
rmSync(databasePath, { force: true });

process.env.DATABASE_PATH = databasePath;
