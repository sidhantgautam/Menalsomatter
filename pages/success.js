// /pages/success.js
import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Success() {
  const router = useRouter();

  useEffect(() => {
    async function fetchSessionEmail() {
      const sessionId = router.query.session_id;
      if (!sessionId) return;

      try {
        const res = await fetch(`/api/get-session?session_id=${sessionId}`);
        const data = await res.json();
        if (data.customer_email) {
          console.log("✅ Saving email to localStorage:", data.customer_email);
          localStorage.setItem("userEmail", data.customer_email);
        }
      } catch (err) {
        console.error("Error fetching session:", err);
      }
    }
    fetchSessionEmail();
  }, [router.query.session_id]);

  return (
    <>
      <Head>
        <title>Payment Success | MenAlsoMatter</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-[#f1f5f9]">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-lg w-full text-center">
          <h1 className="text-3xl font-bold text-[#1E3A8A] mb-4">
            🎉 Payment Successful!
          </h1>
          <p className="text-gray-700 mb-6">
            Thank you for supporting MenAlsoMatter. Your raffle entry has been recorded.
          </p>
          <Link
            href="/"
            className="bg-[#1E3A8A] text-white px-6 py-3 rounded-lg shadow hover:bg-[#3749ac] font-bold transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </>
  );
}
