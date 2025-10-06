import React from "react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-slate-950 text-white py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <div className="space-y-6 text-slate-300">
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-white">Service Description</h2>
            <p>API Cost Guard is a cost tracking and optimization tool for AI API usage.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-white">Free Trial</h2>
            <p>All paid plans include a 14-day free trial. No credit card required to start.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-white">Refunds</h2>
            <p>We offer full refunds within 30 days if you're not satisfied.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-white">Contact</h2>
            <p>Questions? Email us at support@apicostguard.com</p>
          </section>
        </div>
      </div>
    </div>
  );
}