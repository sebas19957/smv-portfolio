import Redis from "ioredis";

let client: Redis | null = null;

const getClient = (): Redis => {
  if (client) return client;

  const url = process.env.REDIS_URL;
  if (!url) {
    throw new Error("REDIS_URL no está definida en las variables de entorno");
  }

  client = new Redis(url, {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  });

  client.on("error", (error) => {
    console.error("Error de conexión con Redis:", error);
  });

  client.on("connect", () => {
    console.log("Conectado a Redis exitosamente");
  });

  return client;
};

// Lazy proxy: the ioredis instance is created on first property access,
// not at module import time (so `next build` doesn't require REDIS_URL).
const redis = new Proxy({} as Redis, {
  get(_target, prop, receiver) {
    const value = Reflect.get(getClient(), prop, receiver);
    return typeof value === "function" ? value.bind(getClient()) : value;
  },
});

export default redis;
