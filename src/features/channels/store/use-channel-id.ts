import { useQueryState } from 'nuqs';

const useChannelId = () => {
  return useQueryState('channelId');
};

export default useChannelId;
