export const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, subject, text }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al enviar el correo");

    return data;
  } catch (error) {
    console.error(error);
    return { error: "No se pudo enviar el correo" };
  }
};
