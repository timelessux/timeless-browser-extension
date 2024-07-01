import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Step = {
  id: string;
  title: string;
  content: string;
  isActive: boolean;
  action: string[];
  customNextButtonText?: string;
};

type tutorialState = {
  ref: DOMRect | null;
  customHeight: number;
  customTop: number;
  customWidth: number;
  customRight: number;
  customLeft: number;
  topText: number;
  steps: Step[];
  stepSellected: Step | null;
  pagination: string[];
};

const initialtutorialState: tutorialState = {
  ref: null,
  customHeight: 0,
  customTop: 0,
  customWidth: 0,
  customLeft: 0,
  customRight: 0,
  topText: 0,
  stepSellected: {
    id: "welcome",
    title: "",
    content: "",
    action: [""],
    isActive: false,
  },
  steps: [],
  pagination: ["welcome", "overview", "wallet", "chat", "social", "links", "stash"],
};

const tutorialSlice = createSlice({
  name: "tutorial",
  initialState: initialtutorialState,
  reducers: {
    setComponent: (
      state,
      {
        payload,
      }: PayloadAction<{
        ref: DOMRect | null;
        customHeight: number;
        customTop: number;
        customWidth: number;
        customLeft: number;
        customRight: number;
        topText: number;
      }>
    ) => {
      state.ref = payload.ref;
      state.customHeight = payload.customHeight;
      state.customTop = payload.customTop;
      state.customWidth = payload.customWidth;
      state.customLeft = payload.customLeft;
      state.customRight = payload.customRight;
      state.topText = payload.topText;
    },

    setStep: (state, { payload }: PayloadAction<{ steps: Step[] }>) => {
      state.steps = payload.steps;
    },

    changeStep: (state, { payload }: PayloadAction<{ step: Step }>) => {
      const tmpSteps = state.steps;
      const index = tmpSteps.findIndex((s) => s.id === payload.step.id);

      if (index !== -1) {
        tmpSteps[index] = payload.step;
      }
      state.steps = tmpSteps;
    },
    nextStep: (state, { payload }: PayloadAction<{ step: Step }>) => {
      const index = state.steps.findIndex((s) => s.id === payload.step.id);
      const nextIndex = index + 1;
      if (index !== -1 && nextIndex <= state.steps.length) {
        state.stepSellected = state.steps[nextIndex];
      }
    },
    setStepSellected: (state, { payload }: PayloadAction<{ step: Step | null }>) => {
      state.stepSellected = payload.step;
    },
  },
});

export const { setComponent, setStep, changeStep, nextStep, setStepSellected } =
  tutorialSlice.actions;

export default tutorialSlice.reducer;
