import statsData from '../data/adminStats.json';

export const getAdminStats = async () => {
  await new Promise(r => setTimeout(r, 100));
  // TODO: Replace with actual API call
  // const response = await fetch('/api/admin/stats');
  // return await response.json();
  return statsData;
};
