import { useQueryState } from 'nuqs';

const useConversationId = () => {
  return useQueryState('conversationId');
};

export default useConversationId;
