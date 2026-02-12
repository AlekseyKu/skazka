import { useEffect } from "react";

import BottomNav from "./BottomNav/BottomNav";
import OnboardingSheet from "./OnboardingSheet";
import OutletErrorBoundary from "./OutletErrorBoundary";
import ToastContainer from "./Toast";
import { useOnboardingStore } from "../stores/onboardingStore";
import { useTrialStore } from "../stores/trialStore";
import { useChildrenProfilesStore } from "../stores/childrenProfilesStore";
import { useSavedLullabiesStore } from "../stores/savedLullabiesStore";

export default function Layout() {
  const hydrateOnboarding = useOnboardingStore((s) => s.hydrate);
  const hydrateTrial = useTrialStore((s) => s.hydrate);
  const hydrateChildren = useChildrenProfilesStore((s) => s.hydrate);
  const hydrateSavedLullabies = useSavedLullabiesStore((s) => s.hydrate);

  useEffect(() => {
    hydrateOnboarding();
    hydrateTrial();
    hydrateChildren();
    hydrateSavedLullabies();
  }, [hydrateOnboarding, hydrateTrial, hydrateChildren, hydrateSavedLullabies]);

  return (
    <>
      <OutletErrorBoundary />
      <BottomNav />
      <OnboardingSheet />
      <ToastContainer />
    </>
  );
}

