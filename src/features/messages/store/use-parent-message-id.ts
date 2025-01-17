import { useQueryState } from "nuqs";

const useParentMessageId = () => {
  return useQueryState("parentMessageId");
};

export default useParentMessageId;
