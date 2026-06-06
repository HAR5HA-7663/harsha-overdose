import type { Metadata } from 'next'
import { LegalShell } from '../../components/LegalShell'

export const metadata: Metadata = {
  title: 'Privacy Policy — Harsha Yellela',
  description: 'How har5ha.in handles visitor data.',
}

export default function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy" effectiveDate="June 5, 2026">
      <section>
        <h2 className="text-[var(--ink)] text-[22px] font-medium mb-3 tracking-[-0.015em]">1. What this site is</h2>
        <p>
          <code className="mono text-[var(--body-strong)]">har5ha.in</code> is the personal portfolio of Harsha Yellela.
          The site is a single-page interactive knowledge graph with a sub-route at <code className="mono">/teli</code>{' '}
          that plays a pre-recorded cinematic. It is not a product. It does not have user accounts.
          It does not sell anything.
        </p>
      </section>

      <section>
        <h2 className="text-[var(--ink)] text-[22px] font-medium mb-3 tracking-[-0.015em]">2. What I collect</h2>
        <p className="mb-2">By visiting har5ha.in, the following may be processed:</p>
        <ul className="list-disc pl-6 space-y-1.5 text-[var(--body-strong)]">
          <li>Standard request metadata (IP, user agent, referrer) by Vercel for hosting + abuse prevention.</li>
          <li>Anonymous aggregate page-view counts (route, country, device class) by Vercel Analytics, if enabled.</li>
          <li>No cookies are set by this site for advertising. No third-party trackers are loaded.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-[var(--ink)] text-[22px] font-medium mb-3 tracking-[-0.015em]">3. What I do with it</h2>
        <p>
          Aggregate counts help me understand which projects recruiters look at most. Request logs
          help diagnose crashes. That is the entire purpose. I do not build profiles, sell data, or
          share visitor information with third parties beyond the infrastructure providers below.
        </p>
      </section>

      <section>
        <h2 className="text-[var(--ink)] text-[22px] font-medium mb-3 tracking-[-0.015em]">4. Infrastructure providers</h2>
        <ul className="list-disc pl-6 space-y-1.5 text-[var(--body-strong)]">
          <li><b>Vercel</b> — hosting, analytics, edge caching. <a href="https://vercel.com/legal/privacy-policy" className="text-[#67E8F9] underline underline-offset-2" target="_blank" rel="noopener noreferrer">policy ↗</a></li>
          <li><b>Google Fonts</b> — font delivery via CDN. <a href="https://policies.google.com/privacy" className="text-[#67E8F9] underline underline-offset-2" target="_blank" rel="noopener noreferrer">policy ↗</a></li>
          <li><b>jsDelivr / Simple Icons</b> — static logo / icon delivery (no scripts, no tracking).</li>
        </ul>
      </section>

      <section>
        <h2 className="text-[var(--ink)] text-[22px] font-medium mb-3 tracking-[-0.015em]">5. Your rights</h2>
        <p>
          If you live in a jurisdiction that grants you data-subject rights (GDPR, CCPA, etc.) you can
          email me to ask what I have on you, request deletion, or correct anything. Realistically:
          I have at most an aggregate request count, so there is rarely much to correct.
        </p>
      </section>

      <section>
        <h2 className="text-[var(--ink)] text-[22px] font-medium mb-3 tracking-[-0.015em]">6. Changes</h2>
        <p>
          If I materially change how the site processes data, I will update the effective date at the
          top of this page and bump the change in the GitHub commit history at{' '}
          <a href="https://github.com/HAR5HA-7663/harsha-overdose" className="text-[#67E8F9] underline underline-offset-2" target="_blank" rel="noopener noreferrer">github.com/HAR5HA-7663/harsha-overdose ↗</a>.
        </p>
      </section>
    </LegalShell>
  )
}
