type DriverStep = {
  element: string;
  popover: {
    title: string;
    description: string;
    side: "top" | "right" | "bottom" | "left";
    align: "start" | "center" | "end";
  };
};

type DriverConfig = {
  showProgress: boolean;
  animate: boolean;
  allowClose: boolean;
  nextBtnText: string;
  prevBtnText: string;
  doneBtnText: string;
  onDestroyed?: () => void;
  steps: DriverStep[];
};

type DriverInstance = {
  drive: () => void;
};

type DriverWindow = Window & {
  driver?: {
    js?: {
      driver: (config: DriverConfig) => DriverInstance;
    };
  };
};

export function startEditorOnboardingTourInFrame(
  iframeWindow: Window,
  onFinish?: () => void,
) {
  const frameDriver = (iframeWindow as DriverWindow).driver?.js?.driver;
  if (!frameDriver) return;

  const driverObj = frameDriver({
    showProgress: true,
    animate: true,
    allowClose: true,
    nextBtnText: "Next",
    prevBtnText: "Back",
    doneBtnText: "Done",
    onDestroyed: onFinish,
    steps: [
      {
        element: '[data-tour="editable-text"]',
        popover: {
          title: "Edit text directly",
          description: "Click any text and type your changes.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: '[data-tour="site-logo"]',
        popover: {
          title: "Change your logos or icons",
          description: "Hover over logos or icons and click Change.",
          side: "bottom",
          align: "center",
        },
      },
    ],
  });

  driverObj.drive();
}
