import { userReminder } from "./remind-users";


export const runAllCronJobs = () => {
  // tokenRemover.start();
  userReminder.start();
};
