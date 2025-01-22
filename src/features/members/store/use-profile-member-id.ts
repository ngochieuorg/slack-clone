import { useQueryState } from "nuqs";

const useProfileMemberId = () => {
  return useQueryState("profileMemberId");
};

export default useProfileMemberId;
