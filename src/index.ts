import { promises as fs } from "fs";
import { resolve } from "path";
import execa from "execa";

export type PM = "npm" | "yarn" | "pnpm";

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

  return execa(pm, ["--version"])
    .then((res) => {
      return /^\d+.\d+.\d+$/.test(res.stdout);
    })
    .then((value) => {
      cache.set(key, value);
      return value;
    })
    .catch(() => false);
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

export function getNpmVersion(pm: PM) {
  return execa(pm || "npm", ["--version"]).then((res) => res.stdout);
}

export function clearCache() {
  return cache.clear();
}
