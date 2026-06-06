import type { Metadata } from 'next'
import { LegalShell } from '../../components/LegalShell'

export const metadata: Metadata = {
  title: 'Terms of Use — Harsha Yellela',
  description: 'Terms for visiting har5ha.in.',
}

export default function TermsPage() {
  return (
    <LegalShell title="Terms of Use" effectiveDate="June 5, 2026">
      <section>
        <h2 className="text-[var(--ink)] text-[22px] font-medium mb-3 tracking-[-0.015em]">1. Acceptance</h2>
        <p>
          By visiting <code className="mono text-[var(--body-strong)]">har5ha.in</code> you agree to the terms below.
          The site is a personal portfolio, provided to you informally. There is no subscription, no
          paid plan, and nothing to log into. If any of this is unacceptable, please close the tab.
        </p>
      </section>

      <section>
        <h2 className="text-[var(--ink)] text-[22px] font-medium mb-3 tracking-[-0.015em]">2. What you can do with the site</h2>
        <ul className="list-disc pl-6 space-y-1.5 text-[var(--body-strong)]">
          <li>View it.</li>
          <li>Click around the knowledge graph and watch the <code className="mono">/teli</code> cinematic.</li>
          <li>Link to any page from any other page on the internet.</li>
          <li>Share screenshots and screen recordings, including in hiring contexts.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-[var(--ink)] text-[22px] font-medium mb-3 tracking-[-0.015em]">3. What you can't do</h2>
        <ul className="list-disc pl-6 space-y-1.5 text-[var(--body-strong)]">
          <li>Scrape the site at a rate that costs me money or degrades the experience for other visitors.</li>
          <li>Attempt to bypass rate limits, abuse the embedded demos, or use the site as part of an attack on third-party infrastructure.</li>
          <li>Misrepresent the site or its content as your own work or as endorsed by someone else.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-[var(--ink)] text-[22px] font-medium mb-3 tracking-[-0.015em]">4. Intellectual property</h2>
        <p>
          The source code of the site is open at{' '}
          <a href="https://github.com/HAR5HA-7663/harsha-overdose" className="text-[#67E8F9] underline underline-offset-2" target="_blank" rel="noopener noreferrer">github.com/HAR5HA-7663/harsha-overdose ↗</a>{' '}
          and licensed under that repository's LICENSE. Words, photography, voice samples, and the
          choreographed <code className="mono">/teli</code> cinematic remain my copyright unless otherwise marked.
          You may quote excerpts with attribution and a link back to the source page.
        </p>
      </section>

      <section>
        <h2 className="text-[var(--ink)] text-[22px] font-medium mb-3 tracking-[-0.015em]">5. The /teli cinematic</h2>
        <p>
          The <code className="mono">/teli</code> sub-route is a <i className="serif-italic">simulated</i> mortgage call. The
          borrower (Sarah Chen) is fictional. The numbers shown ($340K home value, $84K savings, etc.) are
          illustrative. Nothing on the page is mortgage advice, a quote, a rate lock, or a guarantee of
          terms. Real mortgage decisions involve real loan officers and real disclosures — not a portfolio.
        </p>
      </section>

      <section>
        <h2 className="text-[var(--ink)] text-[22px] font-medium mb-3 tracking-[-0.015em]">6. No warranty, limited liability</h2>
        <p>
          The site is provided <i className="serif-italic">as-is</i>, without warranty of any kind. To the maximum
          extent permitted by applicable law, I am not liable for any indirect, incidental, or
          consequential damages arising out of your use of the site.
        </p>
      </section>

      <section>
        <h2 className="text-[var(--ink)] text-[22px] font-medium mb-3 tracking-[-0.015em]">7. Contact</h2>
        <p>
          Questions: <a href="mailto:harsha.yellela@gmail.com" className="text-[var(--ink)] underline underline-offset-2">harsha.yellela@gmail.com</a>.
        </p>
      </section>
    </LegalShell>
  )
}
