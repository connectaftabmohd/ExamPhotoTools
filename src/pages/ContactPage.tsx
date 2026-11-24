import { useState } from 'react';
import { Check, Copy, Mail } from 'lucide-react';
import { usePageMeta } from '@/src/hooks/usePageMeta';
import { Breadcrumbs } from '@/src/components/Breadcrumbs';

export function ContactPage() {
  usePageMeta({ routePath: '/contact' });

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Bug Report / Technical Issue');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const supportEmail = 'support@examphototools.in';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (message.trim().length < 10) {
      setError('Please enter a message of at least 10 characters.');
      return;
    }

    setSubmitted(true);
  };

  const formattedBody = `Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\nMessage:\n${message}`;

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(`To: ${supportEmail}\nSubject: [ExamPhotoTools] ${topic}\n\n${formattedBody}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // ignore clipboard errors
    }
  };

  return (
    <div className="bg-white">
      <section className="border-b border-slate-200 bg-[#F4F8FD]">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Contact' }]} />
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0F294A] sm:text-4xl">Contact ExamPhotoTools</h1>
          <p className="mt-3 text-base leading-relaxed text-slate-600">
            Have feedback, a bug report, or a suggestion for a new Indian exam form utility? Reach out to us below.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="md:col-span-5 space-y-4">
            <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-5 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-[#0F294A]">
                <Mail className="h-4.5 w-4.5 text-[#1D4ED8]" aria-hidden="true" />
                <span>Direct Email</span>
              </div>
              <p className="text-sm text-slate-600">
                Because ExamPhotoTools operates purely as a static, privacy-first web app with no backend database, we do
                not store contact submissions on a server.
              </p>
              <a
                href={`mailto:${supportEmail}`}
                className="inline-block font-mono text-sm font-semibold text-[#1D4ED8] hover:underline"
              >
                {supportEmail}
              </a>
            </div>
          </div>

          <div className="md:col-span-7">
            <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-6 space-y-4" noValidate>
              <h2 className="text-lg font-bold text-[#0F294A]">Prepare a Feedback Message</h2>

              {error && (
                <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs sm:text-sm text-red-900">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-700">
                  Your Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-[#0F294A] focus:border-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20"
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-700">
                  Email Address
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-[#0F294A] focus:border-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20"
                />
              </div>

              <div>
                <label htmlFor="contact-topic" className="block text-xs font-semibold text-slate-700">
                  Topic
                </label>
                <select
                  id="contact-topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-[#0F294A]"
                >
                  <option value="Bug Report / Technical Issue">Bug Report / Technical Issue</option>
                  <option value="New Exam Tool Suggestion">New Exam Tool Suggestion</option>
                  <option value="Accessibility / Mobile Feedback">Accessibility / Mobile Feedback</option>
                  <option value="General Inquiry">General Inquiry</option>
                </select>
              </div>

              <div>
                <label htmlFor="contact-msg" className="block text-xs font-semibold text-slate-700">
                  Message
                </label>
                <textarea
                  id="contact-msg"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your feedback or issue..."
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-[#0F294A] focus:border-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-[#1D4ED8] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1E40AF] transition-colors min-h-[44px]"
              >
                Prepare Message
              </button>

              {submitted && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 space-y-3 text-xs sm:text-sm text-emerald-950">
                  <p className="font-semibold">Message validated and ready to send via your email client.</p>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={`mailto:${supportEmail}?subject=${encodeURIComponent(`[ExamPhotoTools] ${topic}`)}&body=${encodeURIComponent(formattedBody)}`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-800"
                    >
                      <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Open Email App</span>
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyMessage}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-white px-3.5 py-2 text-xs font-semibold text-emerald-900 hover:bg-emerald-100"
                    >
                      {copied ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
                      <span>{copied ? 'Copied!' : 'Copy Message'}</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
