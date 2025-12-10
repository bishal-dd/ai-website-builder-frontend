export default function EmailVerifiedPage() {
  return (
    <div className="container mx-auto p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Email Verified!</h1>
      <p className="text-lg mb-6">Your email has been successfully updated.</p>
      <a href="/dashboard" className="text-blue-600 hover:underline">
        Go to Dashboard
      </a>
    </div>
  );
}
