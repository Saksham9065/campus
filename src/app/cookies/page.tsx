import type { Metadata } from "next";

import LegalPage, { Para, Section } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Cookie Policy — CampusLink",
  description:
    "How CampusLink uses cookies and similar tracking technologies.",
};

export default function CookiesPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      description="Effective as of September 5, 2026. This Cookie Policy explains how CampusLink uses cookies and similar tracking technologies when you visit our Platform."
    >
      <Section title="What Are Cookies">
        <Para>
          Cookies are small text files that are stored on your device (computer,
          phone, or tablet) when you visit a website. We also use similar
          tracking technologies such as web beacons, pixel tags, and local
          storage to collect information about your interaction with the
          Platform.
        </Para>
      </Section>

      <Section title="How We Use Cookies">
        <Para>
          We use cookies and similar technologies for the following purposes:
        </Para>

        <ul className="mt-3 list-decimal space-y-1.5 text-sm text-slate-600 pl-5">
          <li>
            <strong>Essential cookies.</strong> Necessary to provide core
            functionality, authenticate your account, maintain your session, and
            protect against fraud or security incidents. These cannot be
            disabled.
          </li>
          <li>
            <strong>Performance and analytics cookies.</strong> Used to
            understand how visitors interact with the Platform, which features
            are popular, and where users encounter errors, so we can improve
            performance.
          </li>
          <li>
            <strong>Functionality cookies.</strong> Remember your preferences
            (such as language and theme) to provide a more personalized
            experience.
          </li>
          <li>
            <strong>Marketing cookies.</strong> We do not currently use cookies
            for personalized advertising or marketing; we do not share your
            information with third parties for their advertising purposes.
          </li>
        </ul>
      </Section>

      <Section title="Specific Cookies We Use">
        <Para>
          Examples of cookies and similar technologies we may use include:
        </Para>

        <ul className="mt-3 list-decimal space-y-1.5 text-sm text-slate-600 pl-5">
          <li>
            Session management cookies (e.g., to keep you logged in as you
            navigate).
          </li>
          <li>Cross-site request forgery (CSRF) protection tokens.</li>
          <li>
            Analytics identifiers (e.g., Google Analytics or Firebase
            Analytics) that collect anonymized usage data.
          </li>
          <li>
            Preference cookies that store your selected language and theme.
          </li>
        </ul>
        <Para>
          The specific cookies we use may change over time; we will notify you
          of material changes via the Platform or this Policy.
        </Para>
      </Section>

      <Section title="Your Choices">
        <Para>
          Most browsers are configured to accept cookies by default, but you
          can usually change your settings to remove or reject cookies through
          your browser&apos;s settings. Please note that disabling or rejecting
          essential cookies may cause parts of the Platform to stop working
          properly.
        </Para>
      </Section>

      <Section title="Do Not Track">
        <Para>
          The Platform currently does not respond to &quot;Do Not Track&quot; (DNT)
          browser signals. As described in this Cookie Policy, you may use your
          browser settings to control and delete cookies.
        </Para>
      </Section>

      <Section title="Changes to This Policy">
        <Para>
          We may update this Cookie Policy from time to time. When we do, we
          will update the &quot;Last updated&quot; date above and, where required, notify
          you through the Platform.
        </Para>
      </Section>

      <Section title="Contact Us">
        <Para>
          If you have questions about the cookies and tracking technologies we
          use, please contact us at{" "}
          <a
            href="mailto:support@campuslink"
            className="text-indigo-600 underline"
          >
            support@campuslink
          </a>
          .
        </Para>
      </Section>
    </LegalPage>
  );
}
