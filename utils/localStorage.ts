import { storage } from "../firebase";

export type LocalMessage = {
  id: string;
  text: string;
  user: string;
  userId: string;
  createdAt: number;
};

const MESSAGES_KEY = "chat_messages";

export const saveMessagesToLocal = (messages: LocalMessage[]) => {
  try {
    storage.set(MESSAGES_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error("Error saving messages to MMKV storage:", error);
  }
};

export const getMessagesFromLocal = (): LocalMessage[] => {
  try {
    const data = storage.getString(MESSAGES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error getting messages from MMKV storage:", error);
    return [];
  }
};

export const clearLocalMessages = () => {
  try {
    storage.remove(MESSAGES_KEY);
  } catch (error) {
    console.error("Error clearing local messages:", error);
  }
};
