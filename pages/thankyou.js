// pages/thankyou.js
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function ThankYouPage() {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const [credits, setCredits] = useState(0);
  const [earnedCredits, setEarnedCredits] = useState(0);
  const [gap, setGap] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [status, setStatus] = useState("active");
  const [reactivating, setReactivating] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    const { session_id } = router.query;
    if (!session_id) return;

    fetch(`/api/get-session?session_id=${session_id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.customer_email) {
          localStorage.setItem("userEmail", data.customer_email);
          setUserEmail(data.customer_email);
        }
      })
      .catch((err) => console.error(err));
  }, [router.isReady, router.query]);

  useEffect(() => {
    if (!userEmail) return;

    async function awardCreditsAndPing() {
      try {
        const res = await fetch("/api/ping-activity", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userEmail,
            awardAmount: 47,
            sessionId: router.query.session_id,
          }),
        });

        const data = await res.json();
        setCredits(data.credits);
        setStatus(data.status || "active");

        if (!data.alreadyAwarded) {
          setEarnedCredits(47);
          const nearestThreshold = Math.ceil(data.credits / 100) * 100;
          setGap(nearestThreshold - data.credits);
          setShowPopup(true);
        } else {
          router.replace("/");
        }
      } catch (err) {
        console.error(err);
      }
    }

    awardCreditsAndPing();
  }, [userEmail]);

  useEffect(() => {
    if (showPopup) {
      const delay = status === "inactive" ? 7000 : 5000;
      const timer = setTimeout(() => {
        router.replace("/");
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [showPopup, status]);

  const handleReactivate = async () => {
    if (!userEmail) return;
    setReactivating(true);

    try {
      const res = await fetch("/api/reactivate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      });

      const data = await res.json();
      if (data.credits) {
        setCredits(data.credits);
        setEarnedCredits(10);
        setStatus("active");
        setShowPopup(true);

        setTimeout(() => {
          router.replace("/");
        }, 5000);
      }
    } catch (err) {
      console.error(err);
    }

    setReactivating(false);
  };

  const handleOK = () => {
    router.replace("/");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white text-[#1E3A8A] relative">
      <h1 className="text-3xl font-bold">🎉 Thank You for Supporting MenAlsoMatter!</h1>
      <p className="text-lg mt-4 text-center max-w-xl">
        Your donation has been received and your raffle entry has been recorded.
      </p>

      {showPopup && (
        <div className="absolute top-4 right-4 bg-white border border-gray-200 shadow-lg rounded-lg p-4 max-w-xs">
          <p className="text-gray-800 font-semibold">
            ✅ You just earned{" "}
            <span className="text-green-600">{earnedCredits}</span> credits!
          </p>
          {gap !== null && gap > 0 && gap <= 10 && (
            <p className="text-gray-800">
              🎯 You’re only {gap} credits away from your next prize milestone!
            </p>
          )}
          {status === "inactive" ? (
            <button
              className="mt-3 w-full bg-[#14B8A6] text-white py-2 rounded hover:bg-teal-600 transition"
              onClick={handleReactivate}
              disabled={reactivating}
            >
              {reactivating ? "Reactivating..." : "I'm Back 🎉 Reactivate"}
            </button>
          ) : (
            <button
              className="mt-3 w-full bg-gray-300 text-gray-800 py-2 rounded"
              onClick={handleOK}
            >
              OK! 🎉
            </button>
          )}
        </div>
      )}
    </div>
  );
}
