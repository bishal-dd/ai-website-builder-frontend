import { Footer } from "@/features/landing-page/ui/Footer";
import { Header } from "@/features/landing-page/ui/Header";

export default function PrivacyPolicy() {
  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto p-6 text-gray-800 mt-11">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p className="mb-4 text-sm text-gray-600">
          Last updated on <strong>10/04/2026</strong>.
        </p>

        <section className="mb-6">
          <p className="mb-4">
            At <strong>Sencill Ai</strong>, one of our main priorities is the
            privacy of our visitors. This Privacy Policy document contains types
            of information that is collected and recorded by{" "}
            <strong>Sencill Ai</strong> and how we use it.
          </p>
          <p className="mb-4">
            If you have additional questions or require more information about
            our Privacy Policy, do not hesitate to contact us at{" "}
            <a
              href="mailto:contact@lightwebx.com"
              className="text-blue-600 hover:underline"
            >
              contact@lightwebx.com
            </a>
            .
          </p>
          <p className="mb-4">
            This Privacy Policy applies only to our online activities and is
            valid for visitors to our website with regards to the information
            that they shared and/or collected on{" "}
            <a
              href="https://www.sencillai.com/"
              className="text-blue-600 hover:underline"
            >
              https://www.sencillai.com/
            </a>
            . This policy is not applicable to any information collected offline
            or via channels other than this website.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">Consent</h2>
          <p>
            By using our website, you hereby consent to our Privacy Policy and
            agree to its terms.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">
            Information We Collect
          </h2>
          <p className="mb-4">
            The personal information that you are asked to provide, and the
            reasons why you are asked to provide it, will be made clear to you
            at the point we ask you to provide your personal information. .
          </p>
          <p className="mb-4">
            If you contact us directly, we may receive additional information
            about you such as your name, email address, phone number, the
            contents of the message and/or attachments you may send us, and any
            other information you may choose to provide.
          </p>
          <p>
            When you register for an account, we may ask for your contact
            information, including items such as name, company name, address,
            email address, and telephone number.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">
            How We Use Your Information
          </h2>
          <p className="mb-3">
            We use the information we collect in various ways, including to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide, operate, and maintain our website.</li>
            <li>Improve, personalize, and expand our website.</li>
            <li>Understand and analyze how you use our website.</li>
            <li>
              Develop new products, services, features, and functionality.
            </li>
            <li>
              Communicate with you, either directly or through one of our
              partners, including for customer service, to provide you with
              updates and other information relating to the website, and for
              marketing and promotional purposes.
            </li>
            <li>Send you emails.</li>
            <li>Find and prevent fraud.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">Log Files</h2>
          <p className="mb-4">
            <strong>Sencill Ai</strong> follows a standard procedure of using
            log files. These files log visitors when they visit websites. All
            hosting companies do this as part of hosting services&apos;
            analytics.
          </p>
          <p>
            The information collected by log files includes internet protocol
            (IP) addresses, browser type, Internet Service Provider (ISP), date
            and time stamp, referring/exit pages, and possibly the number of
            clicks. These are not linked to any information that is personally
            identifiable.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">
            Cookies and Web Beacons
          </h2>
          <p>
            Like any other website, <strong>Sencill Ai</strong> uses
            &apos;cookies&apos;. These cookies are used to store information
            including visitors&apos; preferences, and the pages on the website
            that the visitor accessed or visited. The information is used to
            optimize the users&apos; experience by customizing our web page
            content based on visitors&apos; browser type and/or other
            information.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">
            CCPA Privacy Rights (Do Not Sell My Personal Information)
          </h2>
          <p className="mb-3">
            Under the CCPA, among other rights, California consumers have the
            right to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Request that a business disclose the categories and specific
              pieces of personal data collected.
            </li>
            <li>
              Request that a business delete any personal data about the
              consumer.
            </li>
            <li>
              Request that a business that sells personal data, not sell that
              personal data.
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">
            GDPR Data Protection Rights
          </h2>
          <p className="mb-3">
            We want to ensure you are fully aware of all of your data protection
            rights. Every user is entitled to the following:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>The right to access:</strong> Request copies of your
              personal data.
            </li>
            <li>
              <strong>The right to rectification:</strong> Request correction of
              inaccurate information.
            </li>
            <li>
              <strong>The right to erasure:</strong> Request deletion of your
              personal data under certain conditions.
            </li>
            <li>
              <strong>The right to data portability:</strong> Request that we
              transfer data to another organization.
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">
            Children&apos;s Information
          </h2>
          <p className="mb-4">
            <strong>Sencill Ai</strong> does not knowingly collect any Personal
            Identifiable Information from children under the age of 13. If you
            think that your child provided this kind of information on our
            website, we strongly encourage you to contact us immediately.
          </p>
        </section>
      </div>
      <Footer />
    </>
  );
}
