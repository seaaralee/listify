import { useUser } from "@clerk/clerk-expo";
export const useUserIdAndNickname = () => {
  const user = useUser().user;
  return [user.id, user.primaryEmailAddress.emailAddress.split("@")[0]];
};
