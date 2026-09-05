import type { Metadata } from "next";

import LegalPage, {
  BulletList,
  Para,
  Section,
} from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy — CampusLink",
  description:
    "How CampusLink collects, uses, shares, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="Effective as of September 5, 2026. This Privacy Policy explains how CampusLink ('we', 'us', or 'our') collects, uses, shares, and protects your information when you use our skill-intelligence platform and related services (the 'Platform')."
    >
      <Section title="Information We Collect">
        <Para>
          <strong>Information you provide directly.</strong> When you register
          or use the Platform, we collect information you provide, including
          your name, email address, phone number, institution, role (student,
          academician, industry, institution), academic background, skills,
          career role, assessment results, portfolio content, resume, and any
          information included in your applications or communications.
        </Para>

        <Para>
          <strong>Information we collect automatically.</strong> We
          automatically receive and record information about your interaction
          with the Platform, including your IP address, browser and device
          information, operating system, the pages you visit, how you navigate,
          the time and date of your visits, search queries, and error
          information. We may use cookies and similar tracking technology for
          this purpose (see our Cookie Policy).
        </Para>

        <Para>
          <strong>Information from third parties.</strong> If you register or
          authenticate using a third-party account (e.g., Google or GitHub), we
          receive information permitted by that provider, which we use to
          identify and manage your account.
        </Para>
      </Section>

      <Section title="How We Use Your Information">
        <Para>We use your information to:</Para>

        <BulletList>
          <li>
            Provide, maintain, and improve the Platform and your personalized
            experience (roadmaps, skill assessments, and opportunity matches).
          </li>
          <li>
            Match your profile with industry, research, and academic
            collaboration opportunities that may interest you.
          </li>
          <li>Process and track your applications and communications.</li>
          <li>
            Send you service-related notices, updates, and support
            communications, and respond to your questions.
          </li>
          <li>
            Analyze usage and performance; detect, investigate, and prevent
            fraud or harmful conduct.
          </li>
        </BulletList>
      </Section>

      <Section title="How We Share Your Information">
        <Para>We do not sell your personal information. We share information:</Para>

        <BulletList>
          <li>
            With service providers who assist us in operating, analyzing, and
            improving the Platform (hosting, analytics, email delivery,
            authentication).
          </li>
          <li>
            With industry partners, institutions, and organizations when you
            apply to an opportunity, in order to evaluate your application (for
            example, your profile, skills, and application materials). We
            require partners to use this information only as instructed.
          </li>
          <li>
            To comply with the law, to respond to lawful requests, and to
            protect the rights, property, or safety of our users and the
            Platform.
          </li>
          <li>
            In connection with a merger, acquisition, or sale of assets,
            provided that any recipient continues to honor this Privacy
            Policy.
          </li>
          <li>
            In aggregated or de-identified form that does not reasonably
            identify you.
          </li>
        </BulletList>
      </Section>

      <Section title="Data Retention">
        <Para>
          We retain your information for as long as necessary to provide the
          Platform and fulfill the purposes described in this Privacy Policy,
          including to meet our legal, analytical, and safety needs. If you
          choose to delete your account, we will remove your personal data within
          a reasonable period of time in accordance with applicable law, subject
          to retention for legitimate business or legal purposes.
        </Para>
      </Section>

      <Section title="Your Rights and Choices">
        <Para>You have the right to:</Para>

        <BulletList>
          <li>
            Access and update your profile information at any time through your
            account settings.
          </li>
          <li>
            Request deletion of your account and personal data (subject to
            legal and retention requirements).
          </li>
          <li>
            Request a portable copy of the information you have provided to us.
          </li>
          <li>
            Object to or restrict certain processing, and to unsubscribe from
            marketing communications (which we send only occasionally and from
            which you may opt out at any time).
          </li>
        </BulletList>
        <Para>
          To make a request or exercise these rights, contact us using the
          details below. We may need to verify your identity before fulfilling
          your request.
        </Para>
      </Section>

      <Section title="Data Security">
        <Para>
          We take the security of your information seriously and use physical,
          administrative, and technical safeguards appropriate to the nature of
          the data, including encryption in transit and at rest where
          applicable. However, no method of transmission over the Internet or
          electronic storage is completely secure; you acknowledge that we
          cannot guarantee its absolute security.
        </Para>
      </Section>

      <Section title="Children">
        <Para>
          The Platform is not directed to children under the age of 16, and we
          do not knowingly collect personal information from children. If we
          learn that we have collected such information, we will delete it.
        </Para>
      </Section>

      <Section title="International Users">
        <Para>
          The Platform is hosted in India and intended for users located
          globally. Your information may be transferred to and processed in
          countries other than your own, which may have different data
          protection laws. We take reasonable steps to ensure your information
          remains protected.
        </Para>
      </Section>

      <Section title="Changes to This Policy">
        <Para>
          We may update this Privacy Policy from time to time. If we do, we will
          revise the &quot;Last updated&quot; date above and, where appropriate, notify
          you through the Platform. Your continued use of the Platform after any
          changes constitutes acceptance of the revised policy.
        </Para>
      </Section>

      <Section title="Contact Us">
        <Para>
          Questions about this Privacy Policy or your data? Contact us at{" "}
          <a
            href="mailto:support@campuslink"
            className="text-indigo-600 underline"
          >
            support@campuslink
          </a>{" "}
          or through the Contact page on the Platform.
        </Para>
      </Section>
    </LegalPage>
  );
}
