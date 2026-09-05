import type { Metadata } from "next";

import LegalPage, { Para, Section } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service — CampusLink",
  description:
    "Terms governing your access to and use of the CampusLink platform.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      description="Effective as of September 5, 2026. These Terms of Service ('Terms') govern your access to and use of the CampusLink platform and related services (the 'Platform'). Please read them carefully before using the Platform."
    >
      <Section title="Acceptance of Terms">
        <Para>
          By accessing or using the Platform, you confirm that you have the
          legal capacity to enter into this agreement and agree to be bound by
          these Terms. If you do not agree, you may not use the Platform. These
          Terms form a binding contract between you and CampusLink (a product of
          CampusLink Technologies).
        </Para>
      </Section>

      <Section title="Eligibility">
        <Para>
          The Platform is intended for individuals who are at least 16 years old
          and organizations in the business of education or recruitment. If you
          are under 16, you may not use the Platform.
        </Para>
      </Section>

      <Section title="Account">
        <Para>
          To use most features you must register for an account and provide
          accurate, current, and complete information. You are responsible for
          maintaining the security of your account and password and for all
          activities that occur under your account. You must notify us
          immediately of any unauthorized use of your account.
        </Para>
      </Section>

      <Section title="License">
        <Para>
          Subject to these Terms, we grant you a limited, non-exclusive,
          revocable right to access and use the Platform for your personal,
          non-commercial use, and to apply to the opportunities and
          collaborations listed on it.
        </Para>
      </Section>

      <Section title="User Content">
        <Para>
          You retain ownership of the content, data, and materials you provide
          through the Platform (including assessments, portfolios, and
          applications). By posting such content, you grant CampusLink a
          worldwide, royalty-free, non-exclusive license to use, host, store,
          reproduce, and display it solely as needed to provide and improve the
          Platform. You represent that your content is accurate and does not
          violate any third-party rights or laws.
        </Para>
      </Section>

      <Section title="Prohibited Conduct">
        <Para>
          You agree not to: use the Platform unlawfully; scrape or harvest data;
          interfere with or disrupt the Platform or its servers; attempt to
          gain unauthorized access; impersonate any person or entity; or post
          content that is defamatory, obscene, or otherwise objectionable.
        </Para>
      </Section>

      <Section title="Third-Party Services">
        <Para>
          The Platform may contain links to third-party websites, services, or
          opportunities (including employer and institution portals). These links
          are provided for convenience and we do not endorse or assume
          responsibility for them. You acknowledge that we are not responsible
          for the content, privacy policies, or practices of any third parties.
        </Para>
      </Section>

      <Section title="Disclaimer">
        <Para>
          THE PLATFORM IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT
          WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST
          EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, INCLUDING THAT
          THE PLATFORM WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE. WE DO NOT
          VERIFY OR ENDORSE THE CONTENT OF OPPORTUNITIES OR COLLABORATIONS
          POSTED BY INDUSTRY, INSTITUTIONS, OR OTHER USERS.
        </Para>
      </Section>

      <Section title="Limitation of Liability">
        <Para>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL CAMPUSLINK
          BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
          PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, OR USE, ARISING OUT OF
          OR RELATED TO THE PLATFORM, WHETHER BASED ON WARRANTY, CONTRACT, TORT
          (INCLUDING NEGLIGENCE), OR ANY OTHER LEGAL THEORY, EVEN IF ADVISED OF
          THE POSSIBILITY OF SUCH DAMAGES. OUR TOTAL LIABILITY ARISING OUT OF
          THESE TERMS WILL NOT EXCEED THE GREATER OF INR 100 OR THE AMOUNT YOU
          PAID US IN THE 12 MONTHS PRECEDING THE EVENT.
        </Para>
      </Section>

      <Section title="Indemnification">
        <Para>
          You agree to indemnify, defend, and hold harmless CampusLink and its
          affiliates, officers, directors, employees, and agents from and
          against any claims, liabilities, damages, losses, and expenses
          (including reasonable attorneys&apos; fees) arising out of or in any way
          connected with your access to or use of the Platform, your content, or
          your violation of these Terms.
        </Para>
      </Section>

      <Section title="Fees and Payment">
        <Para>
          Core features of the Platform are provided free of charge. Certain
          premium features (if any) may be subject to fees, which we will
          clearly identify before you incur them. Fees are non-refundable
          except as required by applicable law.
        </Para>
      </Section>

      <Section title="Term and Termination">
        <Para>
          These Terms remain in effect until terminated. You may terminate your
          account at any time by deleting it through your account settings or by
          contacting us. We may suspend or terminate your access, without notice
          or liability, for any reason, including if we believe you have violated
          these Terms.
        </Para>
      </Section>

      <Section title="Governing Law and Dispute Resolution">
        <Para>
          These Terms are governed by and construed in accordance with the laws
          of India, without regard to conflict of law principles. Any dispute
          arising under these Terms will be resolved exclusively in the courts
          located in Delhi, India.
        </Para>
      </Section>

      <Section title="Changes to These Terms">
        <Para>
          We may revise these Terms from time to time. When we do, we will
          update the &quot;Last updated&quot; date above and, for material changes, notify
          you through the Platform. Your continued use of the Platform after
          such changes constitutes acceptance of the revised Terms.
        </Para>
      </Section>

      <Section title="Contact">
        <Para>
          If you have any questions about these Terms, please contact us at{" "}
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
