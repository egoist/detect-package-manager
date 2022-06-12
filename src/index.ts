import { promises as fs } from "fs";
import { resolve } from "path";
import child_process from "child_process"

export type PM = "npm" | "yarn" | "pnpm";
export const SEMVER_REGEX = /^\d+.\d+.\d+$/

/**
 * Check if a path exists
 */
async function pathExists(p: string) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

const cache = new Map();

/**
 * Check if a global pm is available
 */
function hasGlobalInstallation(pm: PM): Promise<boolean> {
  const key = `has_global_${pm}`;
  if (cache.has(key)) {
    return Promise.resolve(cache.get(key));
  }

  return exec_async(pm, "--version")
    .then((stdout) => {
      return SEMVER_REGEX.test(stdout);
    })
    .then((value) => {
      cache.set(key, value);
      return value;
    });
}

function getTypeofLockFile(cwd = "."): Promise<PM | null> {
  const key = `lockfile_${cwd}`;
  if (cache.has(key)) {
    return Promise.resolve(cache.get(key));
  }

  return Promise.all([
    pathExists(resolve(cwd, "yarn.lock")),
    pathExists(resolve(cwd, "package-lock.json")),
    pathExists(resolve(cwd, "pnpm-lock.yaml")),
  ]).then(([isYarn, isNpm, isPnpm]) => {
    let value: PM | null = null;

    if (isYarn) {
      value = "yarn";
    } else if (isPnpm) {
      value = "pnpm";
    } else if (isNpm) {
      value = "npm";
    }

    cache.set(key, value);
    return value;
  });
}

const detect = async ({ cwd }: { cwd?: string } = {}) => {
  const type = await getTypeofLockFile(cwd);
  if (type) {
    return type;
  }
  const [hasYarn, hasPnpm] = await Promise.all([
    hasGlobalInstallation("yarn"),
    hasGlobalInstallation("pnpm"),
  ]);
  if (hasYarn) {
    return "yarn";
  }
  if (hasPnpm) {
    return "pnpm";
  }
  return "npm";
};

export { detect };

export async function getNpmVersion(pm: PM = "npm") {
  return exec_async(pm || "npm", "--version").then((stdout) => stdout);
}

export function clearCache() {
  return cache.clear();
}

async function exec_async(...commands: string[]): Promise<string> {
  const command_string = commands.join(' ')

  return new Promise((resolve, reject) => {
    child_process.exec(command_string, (error, stdout, stderr) => {
      if (error) return reject(error)
      if (stderr) return reject(stderr.trim())

      resolve(stdout.trim())
    })
  })
}
