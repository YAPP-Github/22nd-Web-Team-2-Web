import React, { useCallback, useEffect, useState } from 'react';

export interface StepsProps<T> {
  component: React.FC<T>;
  path: string;
}

export default function useFunnel<T>(Steps: StepsProps<T>[], pathname: string) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const syncPathWithState = () => {
      const pathname = window.location.pathname.slice(-1);
      const stepIndex = Steps.findIndex(
        (step: StepsProps<T>) => step.path.slice(-1) === pathname
      );
      setCurrentStepIndex(stepIndex >= 0 ? stepIndex : 0);
    };

    window.addEventListener('popstate', syncPathWithState);
    return () => {
      window.removeEventListener('popstate', syncPathWithState);
    };
  }, [Steps]);

  const updatePathname = useCallback(
    (text: string) => {
      const newUrl = `${window.location.origin}${pathname}/${text}`;
      window.history.pushState(null, '', newUrl);
    },
    [pathname]
  );

  const goToNextStep = useCallback(() => {
    if (currentStepIndex < Steps.length - 1) {
      const nextStepIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextStepIndex);
      updatePathname(Steps[nextStepIndex].path);
    }
  }, [Steps, currentStepIndex, updatePathname]);

  return { goToNextStep, currentStepIndex };
}
