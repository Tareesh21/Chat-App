import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

//create(set, get) i.e., coming from zustand
export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  //Initillay the selectedUser is null, because we have will not select any user
  selectedUser: null,
  //when the below isUserLoading is true, we will see some loading skeleton on the sidebar and same for the isMessagesLoading is true
  isUserLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      // Check if the error has a response from the server
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        // Handle cases where there is no server response
        toast.error("Something went wrong. Please try again later.");
      }
    } finally {
      set({ isUsersLoading: false });
    }
  },

//   getUsers: async () => {
//     set({ isUsersLoading: true });
//     try {
//       const res = await axiosInstance.get("/messages/users");
//       set({ users: res.data });
//     } catch (error) {
//       toast.error(error.response.data.message);
//     } finally {
//       set({ isUsersLoading: false });
//     }
//   },

  //we need to pass userId, so that we know which chat that we are trying to fetch
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },


  sendMessage: async (messageData) => {
    //getting the selectedUser and messages, the below get we are getting from zustand
    const { selectedUser, messages } = get();
    try {
        //below we are also sending the messageData to the API
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },


  //todo: optimize this one later
  setSelectedUser: (selectedUser) => set({ selectedUser }),

//   subscribeToMessages: () => {
//     const { selectedUser } = get();
//     if (!selectedUser) return;

//     const socket = useAuthStore.getState().socket;

//     socket.on("newMessage", (newMessage) => {
//       const isMessageSentFromSelectedUser =
//         newMessage.senderId === selectedUser._id;
//       if (!isMessageSentFromSelectedUser) return;

//       set({
//         messages: [...get().messages, newMessage],
//       });
//     });
//   },

//   unsubscribeFromMessages: () => {
//     const socket = useAuthStore.getState().socket;
//     socket.off("newMessage");
//   },

}));
