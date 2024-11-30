import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import {io} from 'socket.io-client'

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";


export const useAuthStore = create((set, get) => ({
  //Initially it is null, because we dont know if user is authenticated or not?
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  //When we refresh the page, we would like to check if the user is authenticated or not, while its checking we can show the loading spinner in the middle of the screen.
  isCheckingAuth: true,
  onlineUsers:[],
  socket:null,

  checkAuth: async () => {
    try {
      //To check whether the user is authenticated
      const res = await axiosInstance.get("/auth/check");

      //setting authUser
      set({ authUser: res.data });
      get().connectSocket()
    } catch (error) {
      console.log("Error in checkAuth", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  //logic for signup
  signup: async (data) => {
    //The below line indicates that the signup process has started
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      console.log("Signup response:", res.data);
      //The user is authenticated.
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket()
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error.response.data.message);
      //The finally block ensures that set({ isSigningUp: false }) runs regardless of whether the signup succeeds or fails.
      //This signals the application that the signup process is complete. As a result:
      //(i) The "Sign Up" button can be re-enabled.
      //(ii)The spinner or loading animation can be hidden.
    } finally {
      console.log("Signup process complete.");
      set({ isSigningUp: false });
    }
  },

  //login setup
  // login: async (data) => {
  //   set({ isLoggingIn: true });
  //   try {
  //     const res = await axiosInstance.post("/auth/login", data);
  //     set({ authUser: res.data });
  //     toast.success("Logged in successfully");
  //   } catch (error) {
  //     toast.error(error.response.data.message);
  //   } finally {
  //     set({ isLoggingIn: false });
  //   }
  // },

    //login setup with socket.io
    login: async (data) => {
      set({ isLoggingIn: true });
      try {
        const res = await axiosInstance.post("/auth/login", data);
        set({ authUser: res.data });
        toast.success("Logged in successfully");
        //calling connectSocket function, now doing same thing with signup
        get().connectSocket()
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        set({ isLoggingIn: false });
      }
    },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket()
    } catch (error) {
      toast.error(error.response.data.message);
      //or//  toast.error('Something went wrong');
    }
  },

  //To upload the latest pic in the database i.e., updating the latest state
  updateProfile: async (data) => {
    //Updating the loading state initially to true
    set({ isUpdatingProfile: true });
    try {
      //sending the request and storing back the response in res
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const {authUser} = get()
    //If the user is not authenticated, we can exit from the function.
    if(!authUser || get().socket?.connected) return;
    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    })
    socket.connect();
    //After we connect, we would like to just set this socket state, with the socket variable that we just have
    set({socket:socket})

    socket.on("getOnlineUsers", (userIds) => {
      set({onlineUsers:userIds})
    })
  },

  disconnectSocket: () => {
    //If we are connected only then try to disconnect.
    if(get().socket?.connected) get().socket.disconnect();
  },
}));
