'use client';
import { useLangRouter } from '@/hooks/useLangRouter';

export default function PrivacyPage() {
  const { push } = useLangRouter();
  return (
    <main className="min-h-screen bg-[#F9FAFB] font-nunito pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => push('/')} className="text-sm font-bold text-gray-400 hover:text-[#D92D20] mb-8 block transition-colors">
          ← Back
        </button>
        <h1 className="text-4xl font-extrabold text-[#101828] mb-2">Privacy Policy</h1>
        <p className="text-gray-400 text-sm font-bold mb-12">Last updated: April 2026</p>

        <div className="space-y-10 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-extrabold text-[#101828] mb-3">1. Information We Collect</h2>
            <p>When you apply or register as a Knowly educator, we collect your name, email address, phone number (optional), and professional experience. When you upload a profile picture, it is stored securely on Vercel Blob Storage.</p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-[#101828] mb-3">2. How We Use Your Information</h2>
            <p>We use your information to manage your educator account, send verification and security codes, display your profile to students on learn.knowly.uz, and communicate important platform updates.</p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-[#101828] mb-3">3. Data Storage & Security</h2>
            <p>Your data is stored in a secured PostgreSQL database. Passwords are hashed using bcrypt and are never stored in plaintext. Authentication uses one-time codes sent to your email and secure HTTP-only cookies.</p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-[#101828] mb-3">4. Data Sharing</h2>
            <p>We do not sell or share your personal data with third parties. Your name, profile picture, and bio may be visible to students on the learning platform as part of your educator profile.</p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-[#101828] mb-3">5. Your Rights</h2>
            <p>You may request deletion or correction of your personal data at any time by contacting us at <a href="mailto:contact@knowly.uz" className="text-[#D92D20] font-bold">contact@knowly.uz</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-[#101828] mb-3">6. Contact</h2>
            <p>Questions about this policy? Reach us at <a href="mailto:contact@knowly.uz" className="text-[#D92D20] font-bold">contact@knowly.uz</a>.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
