import LandingHomepage from '@/features/landing/homepage';

export default function Home() {
  // const [open, setOpen] = useCreateWorkspaceModal();

  // useEffect(() => {
  //   if (isLoading) return;
  //   if (workspaceId) {
  //     router.replace(`/workspace/${workspaceId}`);
  //   } else if (!open) {
  //     setOpen(true);
  //   }
  // }, [workspaceId, isLoading, open, setOpen, router]);

  return <LandingHomepage />;
}
