export function keepServerAwake() {
  setInterval(async () => {
    try {
      const res = await fetch(
        "https://project-initiate-back.onrender.com/keep-alive"
      );
      console.log("🟢 Self-ping successful:", res.status);
    } catch (error: any) {
      console.error("🔴 Self-ping failed:", error.message);
    }
  }, 10 * 60 * 1000); // every 9 minutes
}
