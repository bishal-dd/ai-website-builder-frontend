"use client";

interface FloatingWhatsAppProps {
  phone: string;
}

export function FloatingWhatsApp({ phone }: FloatingWhatsAppProps) {
  if (!phone || phone === "NONE") return null;

  const formattedPhone = phone.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${formattedPhone}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 left-6 z-[9999] bg-green-500 hover:bg-green-600 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-110"
    >
      <img
        src="https://d343yoq90h416j.cloudfront.net/default-images/social-icons/whatsapp-icon.svg"
        alt="WhatsApp"
        data-role="social-icon"
        className="w-7 h-7"
      />
    </a>
  );
}
