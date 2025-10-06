export default function Privacy() {
  return (
    <div className="min-h-screen bg-slate-950 text-white py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <div className="space-y-6 text-slate-300">
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-white">Information We Collect</h2>
            <p>We collect your email address when you sign up for our waitlist. We use ConvertKit to manage our email list.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-white">How We Use Your Information</h2>
            <p>Your email is used solely to notify you about API Cost Guard updates and launch information. We never sell or share your data with third parties.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-white">Your Rights</h2>
            <p>You can unsubscribe at any time using the link in any email we send you.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-white">Contact</h2>
            <p>Questions? Email us at privacy@apicostguard.com</p>
          </section>
        </div>
      </div>
    </div>
  );
}