"use client"
// Define the AuthState type
export interface AuthState {
    isAuthenticated: boolean;
    error: string | null;
  }
  
  // Initial state
  export const initialState: AuthState = {
    isAuthenticated: false,
    error: null,
  };
  
  // Define actions
  type AuthAction =
    | { type: "LOGIN_SUCCESS" }
    | { type: "LOGIN_ERROR"; payload: string }
    | { type: "LOGOUT" };
  
  // Auth reducer function
  export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
      case "LOGIN_SUCCESS":
        return { ...state, isAuthenticated: true, error: null };
      case "LOGIN_ERROR":
        return { ...state, isAuthenticated: false, error: action.payload };
      case "LOGOUT":
        return { ...state, isAuthenticated: false, error: null };
      default:
        return state;
    }
  };
  