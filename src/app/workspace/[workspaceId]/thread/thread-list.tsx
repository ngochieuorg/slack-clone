import { useGetThreads } from '@/features/threads/api/use-get-threads';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import ThreadComponent from './thread';

const ThreadList = () => {
  const workspaceId = useWorkspaceId();
  const { results: threads, status } = useGetThreads({ workspaceId });

  if (status === 'LoadingFirstPage') {
    return null;
  }

  return (
    <>
      {threads.map((thread, index) => {
        return (
          <ThreadComponent
            key={index}
            messageId={thread._id}
            userInThreads={thread.usersInThread}
          />
        );
      })}
    </>
  );
};

export default ThreadList;
