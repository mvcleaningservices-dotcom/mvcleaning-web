import { MessageCircle } from 'lucide-react';

/**
 * Floating WhatsApp button — the #1 conversion tool for Indian local services.
 * Renders fixed at bottom-right, always visible.
 */
export function WhatsAppButton({ phone = '919999999999' }: { phone?: string }) {
  const message = encodeURIComponent('Hi! I\'d like to book a cleaning service.');
  const url = `https://wa.me/${phone}?text=${message}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-fab"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={28} />
      <span className="whatsapp-fab-label">Chat with us</span>
    </a>
  );
}
