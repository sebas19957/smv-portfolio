"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";

import { useLanguage } from "@/contexts/LanguageContext";
import NotificationAlert from "./shared/NotificationAlert";

export default function EmailForm() {
  const { t } = useLanguage();
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
      error = `${t("contact.form.name.error")}`;
    }
    if (name === "email" && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
      error = `${t("contact.form.email.error")}`;
    }
    if (name === "message" && value.trim().length < 10) {
      error = `${t("contact.form.message.error")}`;
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
      
      if (!res.ok) {
        // Determinar el mensaje de error apropiado
        let errorMessage = `${t("contact.error")}`;
        if (res.status === 429) {
          errorMessage = `${t("contact.error.ratelimit")}`;
        } else if (data.error) {
          errorMessage = data.error;
        }
        throw new Error(errorMessage);
      }

      setStatus({
        message: `${t("contact.success")}`,
        error: false,
      });
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `${t("contact.error")}`;
      setStatus({ message: errorMessage, error: true });
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
            placeholder={`${t("contact.form.name")}`}
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
            placeholder={`${t("contact.form.email")}`}
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
            placeholder={`${t("contact.form.message")}`}
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
              {t("contact.form.button.loading")}{" "}
              <Loader2 className="w-4 h-4 ml-2 animate-spin" />
            </>
          ) : (
            <>
              {t("contact.form.button")} <Send className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </form>
      {status &&
        (status.error ? (
          <NotificationAlert
            type="error"
            title={`${t("contact.notificacion.error")}`}
            message={status.message}
            duration={10}
          />
        ) : (
          <NotificationAlert
            type="success"
            title={`${t("contact.notificacion.success")}`}
            message={status.message}
            duration={10}
          />
        ))}
    </motion.div>
  );
}
