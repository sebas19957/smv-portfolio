import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import Redis from "ioredis";

// Configura Redis
const redis = new Redis(process.env.NEXT_PUBLIC_REDIS_URL!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-real-ip") ||
      "Desconocida";

    // Verificar intentos en Redis
    const attempts = await redis.get(`contact_attempts:${ip}`);

    if (attempts && parseInt(attempts) >= 3) {
      return NextResponse.json(
        { error: "Has alcanzado el límite de envíos. Intenta en 24 horas." },
        { status: 429 }
      );
    }

    // Configurar Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NEXT_PUBLIC_EMAIL_USER,
        pass: process.env.NEXT_PUBLIC_EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.NEXT_PUBLIC_EMAIL_USER,
      to: process.env.NEXT_PUBLIC_EMAIL_RECEIVER,
      subject: `Nuevo mensaje de ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd;">
            <h2 style="color: #333;">Nuevo mensaje de contacto</h2>
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Correo:</strong> ${email}</p>
            <p><strong>Mensaje:</strong></p>
            <p style="background-color: #f4f4f4; padding: 10px; border-radius: 5px;">${message}</p>
            <hr/>
            <p style="color: red;"><strong>IP del usuario:</strong> ${ip}</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    // Incrementar intentos en Redis con expiración de 24 horas
    await redis.set(
      `contact_attempts:${ip}`,
      (parseInt(attempts || "0") + 1).toString(),
      "EX",
      86400
    );

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
