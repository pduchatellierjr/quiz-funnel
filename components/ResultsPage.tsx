'use client';

import { ARCHETYPES, PACKAGES } from '@/lib/constants';
import type { ResultsData } from '@/types/quiz';

interface ResultsPageProps {
  profile: ResultsData;
}

export default function ResultsPage({ profile }: ResultsPageProps) {
  // ARCHETYPES and PACKAGES lookups are guaranteed to have valid keys
  // because the API endpoint (Task 7) validates archetype and recommendedPackage
  // before storing in the database
  const archetype = ARCHETYPES[profile.archetype]!;
  const packageInfo = PACKAGES[profile.recommendedPackage]!;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-black border-2 border-[#d4af37] rounded-lg p-12 text-center">
          <p className="text-sm uppercase tracking-widest text-[#d4af37] mb-2 font-semibold">
            Your Couple Profile
          </p>
          <h1 className="text-4xl font-bold mb-4">{archetype.name}</h1>
          <p className="text-lg text-gray-300">{archetype.headline}</p>
        </div>

        {/* Why This Matters */}
        <div className="bg-gray-900 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4 text-[#d4af37]">Why This Matters To You</h2>
          <p className="text-gray-300 leading-relaxed mb-6">{archetype.emotionalMirror}</p>
          <div className="bg-black border-l-4 border-[#d4af37] p-6 italic text-gray-400">
            "{archetype.emotionalMirror.toLowerCase()}"
          </div>
        </div>

        {/* Package Positioning */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#d4af37]">Why {packageInfo.name} is Perfect for You</h2>
          <div className="bg-gray-900 rounded-lg p-8">
            <p className="text-gray-300 mb-6">{packageInfo.positioningMessage}</p>

            <h3 className="text-lg font-semibold mb-4 text-[#d4af37]">What's Included:</h3>
            <div className="space-y-3">
              {packageInfo.deliverables.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <span className="text-[#d4af37] font-bold flex-shrink-0">✓</span>
                  <span className="text-gray-300">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-black border-2 border-[#d4af37] rounded-lg p-12">
          <h2 className="text-2xl font-bold text-[#d4af37] mb-4">Let's Talk About {packageInfo.name}</h2>
          <p className="text-gray-300 mb-8 leading-relaxed">
            We specialize in creating {packageInfo.description.toLowerCase()} that becomes a treasured family memory. Let's talk about your vision and how we can preserve the feeling of your wedding.
          </p>

          <form className="space-y-4" action="https://app.kit.com/forms/9342933/subscriptions" method="POST">
            <input
              type="hidden"
              name="fields[package]"
              value={profile.recommendedPackage}
            />
            <input
              type="hidden"
              name="fields[archetype]"
              value={profile.archetype}
            />
            <input
              type="hidden"
              name="fields[first_name]"
              value={profile.name}
            />

            <div>
              <label className="block text-sm text-gray-400 mb-2">Your Email</label>
              <input
                type="email"
                name="email_address"
                defaultValue={profile.email}
                readOnly
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Wedding Date (optional)</label>
              <input
                type="date"
                name="fields[wedding_date]"
                defaultValue={profile.weddingDate || ''}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#d4af37] text-black font-bold rounded hover:bg-yellow-400 transition uppercase tracking-wide"
            >
              Let's Talk About {packageInfo.name}
            </button>

            <p className="text-xs text-gray-500 text-center">
              We'll be in touch to discuss your vision (and only contact you about your film)
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
