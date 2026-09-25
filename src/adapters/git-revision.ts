import { execFileSync } from 'node:child_process';

import { isIsoDate, type IsoDate } from '@values/iso-date';

export function readGitRevisionDate(): IsoDate | undefined {
  let output = '';
  try {
    output = execFileSync('git', ['log', '-1', '--format=%cs'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
  } catch {
    console.warn('Git revision unavailable; the footer omits the date.');
    return undefined;
  }

  if (!isIsoDate(output)) {
    throw new Error(`Unparseable git date "${output}" (expected YYYY-MM-DD) [in readGitRevisionDate]`, {
      cause: output,
    });
  }
  return output;
}
