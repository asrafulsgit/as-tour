import cron from "node-cron";
import { Booking } from "../modules/booking/booking.model";
import { BOOKING_STATUS } from "../modules/booking/booking.interface";

async function cancelExpiredBookings() {
  try {
    await Booking.updateMany(
      {
        status: BOOKING_STATUS.PENDING,
        expiresAt: { $lt: new Date() },
      },
      {
        $set: {
          status: BOOKING_STATUS.CANCEL,
        },
      },
    );
    console.log("delete some pending booking");
  } catch (err) {
    console.error("Booking expiry job failed:", err);
  }
}

cron.schedule(
  "*/15 * * * *",
  () => {
    console.log("Running booking expiry check...");
    cancelExpiredBookings();
  },
  {
    timezone: "Asia/Dhaka",
  },
);
