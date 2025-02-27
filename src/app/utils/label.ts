interface RenderMemberPreferences {
  displayName?: string;
  fullName?: string;
}

export const renderDisplayName = (
  defaultName?: string,
  preferences?: RenderMemberPreferences
) => {
  return preferences?.displayName || preferences?.fullName || defaultName;
};
