'use client';
import { useLangRouter } from '@/hooks/useLangRouter';

export default function TermsPage() {
  const { push } = useLangRouter();
  return (
    <main className="min-h-screen bg-[#F9FAFB] font-nunito pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => push('/')} className="text-sm font-bold text-gray-400 hover:text-[#D92D20] mb-8 block transition-colors">
          ← Back
        </button>
        <h1 className="text-4xl font-extrabold text-[#101828] mb-2">Terms of Service</h1>
        <p className="text-gray-400 text-sm font-bold mb-12">Last updated: April 2026</p>

        <div className="space-y-10 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-extrabold text-[#101828] mb-3">1. Acceptance</h2>
            <p>By accessing teacher.knowly.uz, you agree to these Terms of Service. If you do not agree, do not use this platform.</p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-[#101828] mb-3">2. Educator Responsibilities</h2>
            <p>As a Knowly educator you agree to: provide accurate and honest information in your application, create original educational content that does not infringe on any copyright, and maintain respectful conduct toward students and the Knowly team.</p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-[#101828] mb-3">3. Content Ownership</h2>
            <p>You retain ownership of the content you create. By publishing on Knowly, you grant Knowly a non-exclusive license to display that content on learn.knowly.uz for educational purposes, free of charge.</p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-[#101828] mb-3">4. Account Security</h2>
            <p>You are responsible for keeping your account credentials confidential. Knowly uses email-based one-time codes for all logins. Report any unauthorized access immediately to <a href="mailto:contact@knowly.uz" className="text-[#D92D20] font-bold">contact@knowly.uz</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-[#101828] mb-3">5. Termination</h2>
            <p>Knowly reserves the right to suspend or terminate accounts that violate these terms, submit false information, or engage in harmful behavior toward the platform or its users.</p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-[#101828] mb-3">6. Disclaimer</h2>
            <p>Knowly is provided "as is" without warranty of any kind. We strive for uptime but cannot guarantee uninterrupted service.</p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-[#101828] mb-3">7. Contact</h2>
            <p>Questions? Contact us at <a href="mailto:contact@knowly.uz" className="text-[#D92D20] font-bold">contact@knowly.uz</a>.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
