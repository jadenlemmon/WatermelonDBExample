import {synchronize} from '@nozbe/watermelondb/sync';
import {database} from './index';

export const syncData = async () => {
  await synchronize({
    database,
    pullChanges: async ({lastPulledAt}) => {
      console.log('pull', lastPulledAt);
      const response = await fetch(
        `http://127.0.0.1:7000/sync?last_pulled_at=${lastPulledAt}`,
      );
      if (!response.ok) {
        throw new Error(await response.text());
      }

      const {changes, timestamp} = await response.json();
      console.log(changes);
      return {changes, timestamp};
    },
    pushChanges: async ({changes, lastPulledAt}) => {
      console.log(changes, 'changes to push');
      const response = await fetch(`http://127.0.0.1:7000/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...changes, lastPulledAt}),
      });
      if (!response.ok) {
        throw new Error(await response.text());
      }
    },
  });
};
