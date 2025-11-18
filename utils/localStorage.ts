import AsyncStorage from "@react-native-async-storage/async-storage";

export type LocalMessage = {
  id: string;
  text: string;
  user: string;
  createdAt: number;
};

const MESSAGES_KEY = "@chat_messages";

export const saveMessagesToLocal = async (messages: LocalMessage[]) => {
  try {
    await AsyncStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error("Error saving messages to local storage:", error);
  }
};

export const getMessagesFromLocal = async (): Promise<LocalMessage[]> => {
  try {
    const data = await AsyncStorage.getItem(MESSAGES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error getting messages from local storage:", error);
    return [];
  }
};

export const clearLocalMessages = async () => {
  try {
    await AsyncStorage.removeItem(MESSAGES_KEY);
  } catch (error) {
    console.error("Error clearing local messages:", error);
  }
};
