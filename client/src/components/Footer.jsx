import React, { useState } from "react";
import qrcode from "../../images/qrcode.jpg";

const Footer = () => {
  // State to manage visibility of sections
  const [activeSection, setActiveSection] = useState(null);

  // Toggle section visibility
  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <footer
      style={{
        padding: "30px 0",
        textAlign: "center",
        borderTop: "1px solid #ccc",
      }}
      className="gradient-bg-footer"
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", color: "#333" }}>
        {/* Company Information */}
        <section className="white-glassmorphism text-base rounded-lg p-8 mb-8  max-w-4xl flex flex-col md:flex-row justify-between items-center">
          <img src={qrcode} height={100} width={100} alt="" />
          <h1 style={{color:'white'}}>
            For Staking and daily rewards send Temz to <br />
            0xE122e541af6c6e1bf90B60b88Dd3e0F25A877406
          </h1>
        </section>
        <p>&copy; 2024 ClimateCrew. All rights reserved.</p>
        <p>
          <a href="mailto:sales@climatecrew.com">sales@climatecrew.com</a>
        </p>

        {/* Links Section */}
        <div style={{ marginTop: "20px" }}>
          <button
            onClick={() => toggleSection("privacyPolicy")}
            style={buttonStyle}
          >
            Privacy Policy
          </button>{" "}
          |
          <button
            onClick={() => toggleSection("termsConditions")}
            style={buttonStyle}
          >
            Terms & Conditions
          </button>{" "}
          |
          <button
            onClick={() => toggleSection("refundPolicy")}
            style={buttonStyle}
          >
            Cancellation & Refund Policy
          </button>{" "}
          |
          <button
            onClick={() => toggleSection("shippingPolicy")}
            style={buttonStyle}
          >
            Shipping & Delivery Policy
          </button>{" "}
          |
          <button
            onClick={() => toggleSection("contactInfo")}
            style={buttonStyle}
          >
            Contact Information
          </button>
        </div>

        {/* Collapsible Sections */}
        {activeSection === "privacyPolicy" && (
          <div style={collapsibleStyle}>
            <h3>Privacy Policy</h3>
            <p>Effective: 2024</p>
            <p>
              1. At ClimateCrew.info ("we," "our," or "us"), we are committed to
              protecting the privacy of our users ("you" or "your"). This
              Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you visit our website or use our
              services. By using our website, you agree to the collection and
              use of information in accordance with this policy. 1. Information
              We Collect We may collect and process the following types of
              information: a. Personal DataWhile using our website, we may ask
              you to provide us with certain personally identifiable
              information, including but not limited to: * Name * Email Address
              * Contact Information * Cryptocurrency Wallet Address (e.g., BNB
              wallet for transactions) b. Non-Personal DataWe may also collect
              non-personally identifiable information, including but not limited
              to: * Browser Information * IP Address * Device Type * Usage Data
              (time spent on the site, pages visited, etc.) 2. How We Use Your
              Information We use the information we collect in the following
              ways: * To process transactions: If you participate in referral
              programs or use our services, we will use your wallet address to
              send/receive tokens such as TEMZ and BNB. * To improve our
              services: We analyze user behavior to better understand how
              visitors use our website and enhance its performance. * To
              communicate with you: We may use your contact information to send
              updates, promotional materials, or important notices regarding our
              services. 3. Sharing of Information We do not sell, trade, or
              otherwise transfer your personal information to third parties,
              except in the following cases: * Service Providers: We may share
              your data with third-party service providers who help us operate
              the website or perform certain functions on our behalf (e.g.,
              payment processors). * Legal Compliance: We may disclose your
              information if required by law or to protect our rights, property,
              or safety, or that of others. 4. Data Security We are committed to
              ensuring that your information is secure. We use industry-standard
              encryption and other security measures to protect your data from
              unauthorized access, disclosure, alteration, or destruction.
              However, please note that no method of transmission over the
              Internet or electronic storage is 100% secure. While we strive to
              protect your personal data, we cannot guarantee its absolute
              security. 5. Cookies We may use cookies and similar tracking
              technologies to track your activity on our website and improve
              user experience. You can instruct your browser to refuse cookies
              or indicate when a cookie is being sent. However, if you do not
              accept cookies, some parts of our website may not function
              properly. 6. Third-Party Links Our website may contain links to
              other websites not operated by us. We are not responsible for the
              content, privacy policies, or practices of these third-party
              sites. We encourage you to read the privacy policies of any
              third-party websites you visit. 7. Your Rights You have the right
              to: * Access and receive a copy of the personal data we hold about
              you. * Correct any personal data that is inaccurate or incomplete.
              * Request the deletion of your personal data, subject to legal and
              contractual restrictions. If you wish to exercise any of these
              rights, please contact us at sales@climatecrew.com 8. Changes to
              This Privacy Policy We reserve the right to modify this Privacy
              Policy at any time. Any changes will be effective immediately upon
              posting the updated policy on the website. Your continued use of
              the website after such changes will constitute your acknowledgment
              of the modified policy. 9. Contact Us If you have any questions
              about this Privacy Policy, please contact us at:Email:
              sales@climatecrew.com
            </p>
            {/* Add full privacy policy content here */}
          </div>
        )}

        {activeSection === "termsConditions" && (
          <div style={collapsibleStyle}>
            <h3>Terms and Conditions</h3>
            <p>Effective Date: 2024</p>
            <p>
              Welcome to ClimateCrew.info ("we," "our," or "us"). By accessing
              or using our website and services, including participation in
              referral programs and blockchain transactions (e.g., BNB and
              TEMZ), you agree to comply with and be bound by these Terms and
              Conditions ("Terms"). Please read them carefully. If you do not
              agree with these Terms, you should not use our website. 1. Use of
              Website a. EligibilityYou must be at least 18 years of age to use
              our website and services. By using our site, you represent and
              warrant thaite and services. By using our site, you represent and
              warrant
            </p>
            {/* Add full terms and conditions content here */}
          </div>
        )}

        {activeSection === "refundPolicy" && (
          <div style={collapsibleStyle}>
            <h3>Cancellation and Refund Policy</h3>
            <p>
              a. Blockchain TransactionsDue to the nature of cryptocurrency
              transactions, all transactions made on ClimateCrew.info are final
              and non-reversible. This includes but is not limited to the
              purchase, transfer, or exchange of TEMZ and BNB. Once a
              transaction is confirmed on the blockchain, it cannot be canceled
              or refunded. You are responsible for ensuring the accuracy of
              wallet addresses and transaction details before initiating any
              transaction. b. Referral ProgramAs part of our referral program,
              once you send BNB to the designated wallet and receive your TEMZ,
              the transaction is complete and non-refundable. No refunds or
              cancellations will be processed for tokens received as part of the
              referral rewards. c. Errors and DiscrepanciesIn the event that you
              encounter any errors in the transfer of tokens due to a technical
              issue or system malfunction on our part, you must notify us within
              24 hours of the transaction. We will review the issue, and if
              found valid, we will work to resolve it. However, we are not
              responsible for errors due to incorrect wallet addresses or
              mistakes on your part. d. ExceptionsRefunds or cancellations may
              be considered under exceptional circumstances, such as proven
              fraud or unauthorized access to your account. Such cases will be
              evaluated at our sole discretion, and we reserve the right to
              decline any refund requests. e. Contact for IssuesIf you believe
              there is an issue with a transaction, or you wish to inquire about
              a potential refund under exceptional circumstances, please contact
              us at:Email: sales@climatecrew.com We will review your request and
              respond within 2 business days.
            </p>
            {/* Add full refund policy content here */}
          </div>
        )}

        {/* Shipping and Delivery Policy */}
        {activeSection === "shippingPolicy" && (
          <div style={collapsibleStyle}>
            <h3>Shipping and Delivery Policy</h3>
            <p>
              As ClimateCrew.info primarily operates as a referral program and
              blockchain platform, we do not ship physical products. All
              transactions on our platform involve digital assets, specifically
              TEMZ and BNB.
            </p>
            <p>
              For any inquiries related to digital token transfers, please refer
              to our <a href="#">Cancellation and Refund Policy</a> or contact
              us at:
            </p>
            <p>
              Email:{" "}
              <a href="mailto:sales@climatecrew.com">sales@climatecrew.com</a>
            </p>
          </div>
        )}

        {/* Contact Information */}
        {activeSection === "contactInfo" && (
          <div style={collapsibleStyle}>
            <h3>Contact Information</h3>
            <p>
              Email:{" "}
              <a href="mailto:sales@climatecrew.com">sales@climatecrew.com</a>
            </p>
            <p>
              We strive to respond to all inquiries as promptly as possible,
              typically within 2 business days. Thank you for your interest in
              ClimateCrew.info!
            </p>
          </div>
        )}
      </div>
    </footer>
  );
};

// Styles for buttons and collapsible sections
const buttonStyle = {
  backgroundColor: "transparent",
  border: "none",
  color: "#007BFF",
  cursor: "pointer",
  marginLeft: "15px",
  marginRight: "15px",
};

const collapsibleStyle = {
  marginTop: "20px",
  textAlign: "left",
  padding: "10px",
  backgroundColor: "#fff",
  border: "1px solid #ccc",
  borderRadius: "5px",
};

export default Footer;
