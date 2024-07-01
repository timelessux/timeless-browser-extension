import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CachedConversation } from "@xmtp/react-sdk";

type ConversationState = {
  conversation: CachedConversation | null
};

const initialConversationState: ConversationState = {
  conversation: null
};

const ConversationSlice = createSlice({
  name: "conversation",
  initialState: initialConversationState,
  reducers: {
    setConversation: (
      state,
      { payload }: PayloadAction<CachedConversation>
    ) => {
      state.conversation = payload;
    },
  },
});

export const { setConversation } = ConversationSlice.actions;

export default ConversationSlice.reducer;
