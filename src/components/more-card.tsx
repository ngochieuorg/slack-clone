import { navigationItems } from '@/constant/navigation';
import usePreferencesModal from '@/features/preferences/hooks/use-preferences-modal';
import { preferencesAtom } from '@/store/preferences.store';
import { useAtom } from 'jotai';

const MoreCard = () => {
  const [{ preferences }] = useAtom(preferencesAtom);

  const { component: Preferences } = usePreferencesModal({
    trigger: (
      <div className="px-4 py-4 text-sky-800 text-sm font-normal hover:bg-slate-100 cursor-pointer">
        Customize navigation bar
      </div>
    ),
    preSelect: 1,
  });

  return (
    <div className="flex flex-col min-w-96 pt-4">
      <h6 className="font-semibold px-4 mb-2">More</h6>
      <div className="flex flex-col">
        {navigationItems
          .filter((item) => {
            if (!preferences?.navigation?.includes(item.id)) return true;
            return false;
          })
          .map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="flex gap-2 cursor-pointer group hover:bg-slate-100 px-4 py-1"
              >
                <div className="size-10 rounded bg-[#F9EDFF] flex items-center justify-center group-hover:bg-[#c492c5]">
                  <Icon className="text-[#481349] size-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{item.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
      </div>
      {Preferences}
    </div>
  );
};

export default MoreCard;
