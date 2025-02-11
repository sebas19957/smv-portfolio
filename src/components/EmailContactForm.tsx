"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import NotificationAlert from "./layouts/NotificationAlert";

export default function EmailForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    message: string;
    error: boolean;
  } | null>(null);

  const validateField = (name: string, value: string) => {
    let error = "";

    if (name === "name" && value.trim().length < 3) {
      error = "El nombre debe tener al menos 3 caracteres.";
    }
    if (name === "email" && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
      error = "Ingrese un correo válido.";
    }
    if (name === "message" && value.trim().length < 10) {
      error = "El mensaje debe tener al menos 10 caracteres.";
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const isFormValid = () => {
    return (
      form.name.length >= 3 &&
      /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email) &&
      form.message.length >= 10 &&
      !errors.name &&
      !errors.email &&
      !errors.message
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) return;

    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: `Portafolio: Mensaje de ${form.name}`,
          message: form.message,
          name: form.name,
          email: form.email,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al enviar el mensaje");

      setStatus({
        message: "Mensaje enviado con éxito",
        error: false,
      });
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      setStatus({ message: "No se pudo enviar el mensaje", error: true });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      transition={{ delay: 0.6 }}
      className="bg-card p-2 md:p-8 rounded-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nombre"
            className="bg-background"
            required
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>
        <div>
          <Input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Correo Electrónico"
            className="bg-background"
            required
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
        <div>
          <Textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Mensaje"
            className="min-h-[200px] bg-background"
            required
          />
          {errors.message && (
            <p className="text-red-500 text-sm mt-1">{errors.message}</p>
          )}
        </div>
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={loading || !isFormValid()}
        >
          {loading ? (
            <>
              Enviando... <Loader2 className="w-4 h-4 ml-2 animate-spin" />
            </>
          ) : (
            <>
              Enviar Mensaje <Send className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </form>
      {status &&
        (status.error ? (
          <NotificationAlert
            type="error"
            title="Error"
            message={status.message}
            duration={10}
          />
        ) : (
          <NotificationAlert
            type="success"
            title="Operación exitosa"
            message={status.message}
            duration={10}
          />
        ))}
    </motion.div>
  );
}
