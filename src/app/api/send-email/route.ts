import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import redis from "@/lib/redis";
import { generateContactEmailTemplate } from "@/lib/email-templates/contact-notification";

const ATTEMPT_LIMIT = 3;
const TIME_WINDOW_SECONDS = 24 * 60 * 60; // 24 horas en segundos

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const redisKey = `contact_attempts:${ip}`;

    // Verificar intentos en Redis
    const currentAttempts = await redis.get(redisKey);
    const attemptCount = currentAttempts ? parseInt(currentAttempts, 10) : 0;

    if (attemptCount >= ATTEMPT_LIMIT) {
      const ttl = await redis.ttl(redisKey);
      const hoursRemaining = Math.ceil(ttl / 3600);
      return NextResponse.json(
        { 
          error: `Has alcanzado el límite de envíos. Intenta en ${hoursRemaining} hora${hoursRemaining > 1 ? 's' : ''}.` 
        },
        { status: 429 }
      );
    }

    // Configurar Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const htmlContent = generateContactEmailTemplate({
      name,
      email,
      message,
      ip,
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_RECEIVER,
      subject: `📬 Nuevo mensaje de ${name} - Portfolio SMV`,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    // Incrementar intentos en Redis
    const newCount = await redis.incr(redisKey);
    
    // Si es el primer intento, establecer el TTL de 24 horas
    if (newCount === 1) {
      await redis.expire(redisKey, TIME_WINDOW_SECONDS);
    }

    return NextResponse.json(
      { success: "Correo enviado correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al enviar el correo" },
      { status: 500 }
    );
  }
}
