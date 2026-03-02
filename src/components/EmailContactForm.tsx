"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Send, Loader2, User, Mail, MessageSquare } from "lucide-react";

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
  const [focused, setFocused] = useState<string | null>(null);

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
      className="relative"
    >
      {/* Badge flotante */}
      <div
        className="absolute -top-5 left-4 z-10"
        style={{ transform: "rotate(-2deg)" }}
      >
        <span
          className="inline-block px-5 py-2 font-black text-sm uppercase shadow-lg"
          style={{
            fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif",
            backgroundColor: "#f5c518",
            color: "#000",
          }}
        >
          {t("contact.title") || "Get in Touch"}
        </span>
      </div>

      {/* Formulario con estilo brutalista */}
      <div
        className="p-8 pt-12 shadow-2xl bg-zinc-900"
        style={{
          transform: "rotate(0.5deg)",
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo Nombre */}
          <div className="relative">
            <label
              className="text-xs font-black text-yellow-400 uppercase tracking-wider mb-2 block"
              style={{
                fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif",
              }}
            >
              {t("contact.form.name")}
            </label>
            <div className={`relative flex items-center border-2 transition-all duration-300 ${
              focused === "name" ? "border-yellow-400" : errors.name ? "border-red-500" : "border-zinc-700"
            }`}>
              <div className="px-4 py-3 bg-black/30 border-r-2 border-zinc-700">
                <User className={`w-5 h-5 ${focused === "name" ? "text-yellow-400" : "text-gray-500"}`} />
              </div>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                onFocus={() => setFocused("name")}
                onBlur={() => setFocused(null)}
                placeholder={`${t("contact.form.name.placeholder") || "Your name"}`}
                className="flex-1 px-4 py-3 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm"
                style={{
                  fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif",
                }}
                required
              />
            </div>
            {errors.name && (
              <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                <span className="inline-block w-1 h-1 bg-red-400 rounded-full"></span>
                {errors.name}
              </p>
            )}
          </div>

          {/* Campo Email */}
          <div className="relative">
            <label
              className="text-xs font-black text-yellow-400 uppercase tracking-wider mb-2 block"
              style={{
                fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif",
              }}
            >
              {t("contact.form.email")}
            </label>
            <div className={`relative flex items-center border-2 transition-all duration-300 ${
              focused === "email" ? "border-yellow-400" : errors.email ? "border-red-500" : "border-zinc-700"
            }`}>
              <div className="px-4 py-3 bg-black/30 border-r-2 border-zinc-700">
                <Mail className={`w-5 h-5 ${focused === "email" ? "text-yellow-400" : "text-gray-500"}`} />
              </div>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                placeholder={`${t("contact.form.email.placeholder") || "your@email.com"}`}
                className="flex-1 px-4 py-3 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm"
                style={{
                  fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif",
                }}
                required
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                <span className="inline-block w-1 h-1 bg-red-400 rounded-full"></span>
                {errors.email}
              </p>
            )}
          </div>

          {/* Campo Mensaje */}
          <div className="relative">
            <label
              className="text-xs font-black text-yellow-400 uppercase tracking-wider mb-2 block"
              style={{
                fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif",
              }}
            >
              {t("contact.form.message")}
            </label>
            <div className={`relative border-2 transition-all duration-300 ${
              focused === "message" ? "border-yellow-400" : errors.message ? "border-red-500" : "border-zinc-700"
            }`}>
              <div className="flex items-start">
                <div className="px-4 py-3 bg-black/30 border-r-2 border-zinc-700 self-stretch flex items-center justify-center min-h-[150px]">
                  <MessageSquare className={`w-5 h-5 ${focused === "message" ? "text-yellow-400" : "text-gray-500"}`} />
                </div>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  onFocus={() => setFocused("message")}
                  onBlur={() => setFocused(null)}
                  placeholder={`${t("contact.form.message.placeholder") || "Write your message here..."}`}
                  className="flex-1 px-4 py-3 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm min-h-[150px] resize-none"
                  style={{
                    fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif",
                  }}
                  required
                />
              </div>
            </div>
            {errors.message && (
              <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                <span className="inline-block w-1 h-1 bg-red-400 rounded-full"></span>
                {errors.message}
              </p>
            )}
          </div>

          {/* Botón de envío */}
          <Button
            type="submit"
            size="lg"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-black uppercase tracking-wider py-6 text-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
            style={{
              fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif",
            }}
            disabled={loading || !isFormValid()}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                {t("contact.form.button.loading")}
                <Loader2 className="w-5 h-5 animate-spin" />
              </span>
            ) : (
              <span className="flex items-center justify-center gap-3">
                {t("contact.form.button")}
                <Send className="w-5 h-5" />
              </span>
            )}
          </Button>
        </form>
      </div>

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
