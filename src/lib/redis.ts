import Redis from "ioredis";

const getRedisUrl = () => {
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL;
  }
  throw new Error("REDIS_URL no está definida en las variables de entorno");
};

const redis = new Redis(getRedisUrl(), {
  maxRetriesPerRequest: 3,
  lazyConnect: true,
});

redis.on("error", (error) => {
  console.error("Error de conexión con Redis:", error);
});

redis.on("connect", () => {
  console.log("Conectado a Redis exitosamente");
});

export default redis;
