import cron from 'node-cron';
import db from '../db.js';

export function startIsActiveJob() {
  cron.schedule('*/1 * * * *', async () => {
    try {
      await db.execute(`
        UPDATE media_tv
        SET is_active = (
          CASE
            WHEN start_time IS NOT NULL
              AND (end_time IS NULL OR NOW() <= end_time)
              AND NOW() >= start_time
            THEN TRUE
            ELSE FALSE
          END
        )
      `);
      console.log('[CRON] is_active updated.');
    } catch (err) {
      console.error('[CRON] Failed to update is_active:', err);
    }
  });
}
