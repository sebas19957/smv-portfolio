import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Almacenamiento local para intentos de contacto
interface AttemptRecord {
  count: number;
  timestamp: number;
}

const contactAttempts = new Map<string, AttemptRecord>();
const ATTEMPT_LIMIT = 3;
const TIME_WINDOW = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

// Limpiar registros antiguos periódicamente
function cleanOldAttempts() {
  const now = Date.now();
  for (const [ip, record] of contactAttempts.entries()) {
    if (now - record.timestamp > TIME_WINDOW) {
      contactAttempts.delete(ip);
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-real-ip") ||
      "Desconocida";

    // Limpiar intentos antiguos
    cleanOldAttempts();

    // Verificar intentos locales
    const now = Date.now();
    const attemptRecord = contactAttempts.get(ip);

    if (attemptRecord) {
      // Si han pasado más de 24 horas, resetear el contador
      if (now - attemptRecord.timestamp > TIME_WINDOW) {
        contactAttempts.delete(ip);
      } else if (attemptRecord.count >= ATTEMPT_LIMIT) {
        return NextResponse.json(
          { error: "Has alcanzado el límite de envíos. Intenta en 24 horas." },
          { status: 429 }
        );
      }
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

    // Incrementar intentos locales
    if (attemptRecord) {
      attemptRecord.count += 1;
    } else {
      contactAttempts.set(ip, { count: 1, timestamp: now });
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
