const DOWN_MS = 10_000;

let available = false;
let downUntil = 0;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("db-timeout")), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error: unknown) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

export function markDatabaseDown() {
  available = false;
  downUntil = Date.now() + DOWN_MS;
}

export async function isDatabaseAvailable(): Promise<boolean> {
  if (available) {
    return true;
  }
  if (Date.now() < downUntil) {
    return false;
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    await withTimeout(prisma.$runCommandRaw({ ping: 1 }), 12_000);
    available = true;
    return true;
  } catch {
    markDatabaseDown();
    return false;
  }
}

/** "down" значи да пример подаци треба да се прикажу. */
export async function queryDatabase<T>(read: () => Promise<T>): Promise<T | "down"> {
  if (!(await isDatabaseAvailable())) {
    return "down";
  }

  try {
    return await read();
  } catch {
    markDatabaseDown();
    return "down";
  }
}
