import { Footer } from "@/features/landing-page/ui/Footer";
import { Header } from "@/features/landing-page/ui/Header";

export default function TermsAndConditions() {
  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto p-6 text-gray-800 leading-relaxed mt-11">
        <h1 className="text-3xl font-bold mb-4">Terms and Conditions</h1>
        <p className="mb-6 text-sm text-gray-600">
          Last updated on <strong>10/04/2026</strong>.
        </p>

        <p className="mb-6 italic">
          Please read these terms and conditions carefully before using Our
          Service.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 border-b pb-2">
            Acknowledgment
          </h2>
          <div className="space-y-4">
            <p>
              These are the Terms and Conditions governing the use of this
              Service and the agreement that operates between you and the
              Company. These Terms and Conditions set out the rights and
              obligations of all users regarding the use of the Service.
            </p>
            <p>
              Your access to and use of the Service is conditioned on your
              acceptance of and compliance with these Terms and Conditions.
              These Terms and Conditions apply to all visitors, users, and
              others who access or use the Service.
            </p>
            <p>
              By accessing or using the Service you agree to be bound by these
              Terms and Conditions. If you disagree with any part of these Terms
              and Conditions, then you may not access the Service.
            </p>
            <p>
              Your access to and use of the Service is also conditioned on your
              acceptance of and compliance with the Privacy Policy of the
              Company. Please read Our Privacy Policy carefully before using Our
              Service.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 border-b pb-2">
            User Accounts
          </h2>
          <div className="space-y-4">
            <p>
              When you create an account with us, you must provide us with
              information that is accurate, complete, and current at all times.
              Failure to do so constitutes a breach of the Terms, which may
              result in the immediate termination of your account.
            </p>
            <p>
              You are responsible for safeguarding the password that you use to
              access the Service and for any activities or actions under your
              password.
            </p>
            <p>
              You agree not to disclose your password to any third party. You
              must notify us immediately upon becoming aware of any breach of
              security or unauthorized use of your account.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 border-b pb-2">
            Copyright Policy
          </h2>
          <h3 className="text-xl font-medium mb-2">
            Intellectual Property Infringement
          </h3>
          <p className="mb-4">
            All content, features, and functionality of our services, including
            but not limited to text, graphics, logos, and software, are the
            exclusive property of <strong>Sencill AI</strong>.
          </p>

          <h3 className="text-xl font-medium mb-2">
            DMCA Notice and Procedure
          </h3>
          <p className="mb-2">
            You may submit a notification pursuant to the DMCA by providing our
            Copyright Agent with:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              An electronic or physical signature of the authorized person.
            </li>
            <li>
              A description of the copyrighted work claimed to have been
              infringed.
            </li>
            <li>
              Identification of the URL or specific location on the Service.
            </li>
            <li>Your address, telephone number, and email address.</li>
            <li>
              A statement of good faith belief and a statement made under
              penalty of perjury.
            </li>
          </ul>
          <p>
            Contact our copyright agent at:{" "}
            <a
              href="mailto:bishal.dhakal@lightwebx.com"
              className="text-blue-600 hover:underline"
            >
              bishal.dhakal@lightwebx.com
            </a>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 border-b pb-2">
            Intellectual Property
          </h2>
          <p className="mb-4">
            The Service and its original content, features, and functionality
            are and will remain the exclusive property of the Company and its
            licensors.
          </p>
          <p>
            Our trademarks and trade dress may not be used in connection with
            any product or service without the prior written consent of the
            Company.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 border-b pb-2">
            Limitation of Liability
          </h2>
          <p className="mb-4">
            The entire liability of the Company and any of its suppliers under
            any provision of these Terms shall be limited to the amount actually
            paid by you through the Service or 100 USD if you haven&apos;t
            purchased anything.
          </p>
          <div className="bg-gray-50 p-4 border rounded shadow-sm">
            <h3 className="text-lg font-bold mb-2">
              &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; Disclaimer
            </h3>
            <p className="text-sm">
              The Service is provided to You &quot;AS IS&quot; and &quot;AS
              AVAILABLE&quot; without warranty of any kind. The Company
              disclaims all warranties, whether express, implied, or statutory,
              including all implied warranties of merchantability and fitness
              for a particular purpose.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 border-b pb-2">
            Governing Law
          </h2>
          <p>
            The laws of <strong>Bhutan</strong>, excluding its conflicts of law
            rules, shall govern these Terms and your use of the Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 border-b pb-2">
            Contact Us
          </h2>
          <p className="mb-2">
            If you have any questions about these Terms and Conditions, contact
            us:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              Website:{" "}
              <a
                href="https://www.sencillai.com/"
                className="text-blue-600 hover:underline"
              >
                https://www.sencillai.com/
              </a>
            </li>
            <li>
              Email:{" "}
              <a
                href="mailto:contact@lightwebx.com"
                className="text-blue-600 hover:underline"
              >
                contact@lightwebx.com
              </a>
            </li>
          </ul>
        </section>
      </div>
      <Footer />
    </>
  );
}
