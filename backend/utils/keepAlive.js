import cron from "node-cron";

const BACKEND_URL = "https://nitaidalal-portfolio.onrender.com/";

const startKeepAlive = () => {
  cron.schedule("*/14 * * * *", async () => {
    try {
      const res = await fetch(BACKEND_URL);
      const data = await res.json();
      console.log(
        `[KeepAlive] ✅ ${new Date().toISOString()} — ${data.message}`,
      );
    } catch (error) {
      console.error(
        `[KeepAlive] ❌ ${new Date().toISOString()} — ${error.message}`,
      );
    }
  });

  console.log("🔄 Keep-alive cron started — pinging every 14 minutes");
};

export default startKeepAlive;
