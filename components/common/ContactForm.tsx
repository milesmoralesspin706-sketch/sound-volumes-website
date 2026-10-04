'use client';

import React, { useState } from 'react';
import { useCMS } from '@/lib/cms-context';
import { CheckCircle2, Send, ShieldCheck } from 'lucide-react';

interface ContactFormProps {
  initialRoutingKey?: string;
  sourceSiteName?: string;
  onSuccess?: () => void;
}

export function ContactForm({ initialRoutingKey = 'general', sourceSiteName = 'Sound Volumes' }: ContactFormProps) {
  const { data } = useCMS();
  const routingRules = data.settings.contactRouting;

  const [routingKey, setRoutingKey] = useState(initialRoutingKey);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const currentRule = routingRules.find(r => r.key === routingKey) || routingRules[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) {
      // Spam honeypot tripped
      return;
    }
    if (!name.trim() || !email.trim() || !message.trim()) {
      return;
    }

    setIsSubmitting(true);
    // Simulate real secure central dispatch
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTicketId(`SV-${Math.floor(100000 + Math.random() * 900000)}`);
    }, 700);
  };

  const handleReset = () => {
    setSubmitted(false);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  if (submitted) {
    return (
      <div className="bg-[#fcfbf8] border border-[#ddd5c7] p-6 sm:p-10 text-center max-w-xl mx-auto shadow-xs">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#eee7db] text-[#1c1917] mb-4">
          <CheckCircle2 className="w-6 h-6 stroke-[1.5]" />
        </div>
        <h3 className="font-serif text-2xl text-[#1c1917] mb-2">Message Dispatched</h3>
        <p className="text-xs sm:text-sm text-[#524b43] mb-4 font-sans leading-relaxed">
          Your correspondence has been securely routed to the {currentRule.label} desk.
          Our editorial team reviews communications in sequence.
        </p>
        <div className="bg-[#f0eae0] border border-[#ded5c5] py-2 px-4 inline-block font-mono text-xs text-[#2c2824] mb-6">
          Reference: {ticketId}
        </div>
        <div>
          <button
            onClick={handleReset}
            className="text-xs uppercase tracking-wider text-[#1c1917] border-b border-[#1c1917] pb-0.5 hover:text-[#944222] hover:border-[#944222] transition-colors min-h-[36px]"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 max-w-xl mx-auto">
      {sourceSiteName !== 'Sound Volumes' && (
        <div className="bg-[#eee7db] border-l-2 border-[#944222] py-2 px-3 text-xs text-[#524b43] font-sans">
          Routing inquiry via the central <span className="font-medium text-[#1c1917]">Sound Volumes</span> editorial desk.
        </div>
      )}

      {/* Inquiry Topic Routing */}
      <div>
        <label htmlFor="routing-topic" className="block text-xs uppercase tracking-widest text-[#524b43] font-sans mb-1.5">
          Inquiry Destination / Topic
        </label>
        <select
          id="routing-topic"
          value={routingKey}
          onChange={(e) => setRoutingKey(e.target.value)}
          className="w-full bg-[#fdfcf9] border border-[#d8cfbe] px-3.5 py-2.5 text-base sm:text-sm text-[#1c1917] focus:outline-none focus:ring-1 focus:ring-[#1c1917] focus:border-[#1c1917] font-sans rounded-xs"
        >
          {routingRules.map((rule) => (
            <option key={rule.key} value={rule.key}>
              {rule.label}
            </option>
          ))}
        </select>
        {currentRule.description && (
          <p className="text-[12px] text-[#736b62] font-sans mt-1">
            {currentRule.description}
          </p>
        )}
      </div>

      {/* Honeypot field (hidden from genuine users) */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="client-check-code">Leave this blank</label>
        <input
          id="client-check-code"
          type="text"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="sender-name" className="block text-xs uppercase tracking-widest text-[#524b43] font-sans mb-1.5">
            Your Name <span className="text-[#8c847a]">*</span>
          </label>
          <input
            id="sender-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#fdfcf9] border border-[#d8cfbe] px-3.5 py-2.5 text-base sm:text-sm text-[#1c1917] focus:outline-none focus:ring-1 focus:ring-[#1c1917] focus:border-[#1c1917] font-sans rounded-xs"
            placeholder="Jane Doe"
          />
        </div>

        <div>
          <label htmlFor="sender-email" className="block text-xs uppercase tracking-widest text-[#524b43] font-sans mb-1.5">
            Email Address <span className="text-[#8c847a]">*</span>
          </label>
          <input
            id="sender-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#fdfcf9] border border-[#d8cfbe] px-3.5 py-2.5 text-base sm:text-sm text-[#1c1917] focus:outline-none focus:ring-1 focus:ring-[#1c1917] focus:border-[#1c1917] font-sans rounded-xs"
            placeholder="jane@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject-line" className="block text-xs uppercase tracking-widest text-[#524b43] font-sans mb-1.5">
          Subject / Context
        </label>
        <input
          id="subject-line"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full bg-[#fdfcf9] border border-[#d8cfbe] px-3.5 py-2.5 text-base sm:text-sm text-[#1c1917] focus:outline-none focus:ring-1 focus:ring-[#1c1917] focus:border-[#1c1917] font-sans rounded-xs"
          placeholder="Brief note on topic..."
        />
      </div>

      <div>
        <label htmlFor="message-body" className="block text-xs uppercase tracking-widest text-[#524b43] font-sans mb-1.5">
          Message <span className="text-[#8c847a]">*</span>
        </label>
        <textarea
          id="message-body"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full bg-[#fdfcf9] border border-[#d8cfbe] px-3.5 py-2.5 text-base sm:text-sm text-[#1c1917] focus:outline-none focus:ring-1 focus:ring-[#1c1917] focus:border-[#1c1917] font-sans resize-y rounded-xs"
          placeholder="Please state the nature of your inquiry..."
        />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-1.5 text-xs text-[#736b62] font-sans">
          <ShieldCheck className="w-3.5 h-3.5 text-[#944222]" />
          <span>Direct publisher routing. Anti-spam protected.</span>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#1c1917] hover:bg-[#2c2824] text-[#fbf9f5] text-xs uppercase tracking-widest font-sans font-medium transition-colors disabled:opacity-50 min-h-[44px]"
        >
          {isSubmitting ? (
            <span>Dispatching...</span>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>Send Message</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
