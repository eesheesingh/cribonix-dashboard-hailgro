// import React, { createContext, useReducer, useContext } from 'react';

// const AuthContext = createContext();

// const authReducer = (state, action) => {
//   switch (action.type) {
//     case 'LOGIN':
//       return {
//         ...state,
//         isAuthenticated: true,
//         user: action.payload,
//       };
//     case 'LOGOUT':
//       return {
//         ...state,
//         isAuthenticated: false,
//         user: null,
//       };
//     default:
//       return state;
//   }
// };

// const AuthProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(authReducer, {
//     isAuthenticated: false,
//     user: null,
//   });

//   const login = (user) => {
//     dispatch({ type: 'LOGIN', payload: user });
//   };

//   const logout = () => {
//     dispatch({ type: 'LOGOUT' });
//   };

//   return (
//     <AuthContext.Provider value={{ state, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// const useAuth = () => useContext(AuthContext);

// export { AuthProvider, useAuth };
