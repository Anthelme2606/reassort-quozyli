import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useGetCurrentUserLazyQuery, useGetCurrentUserSubscription } from "../../services/user-service";
import useTokenRefresh from "../../hooks/useTokenRefresh";

const UserContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = Cookies.get("currentUser");
    return savedUser ? JSON.parse(savedUser) : { isAuth: false, auth: null };
  });
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const initialToken = Cookies.get("token");
  let initialLifeTime = Cookies.get("lifeTime");
  initialLifeTime = initialLifeTime ? parseInt(initialLifeTime) : null;
 
  useTokenRefresh();

  const [loadCurrentUser, { data: dataQuery, loading, error }] = useGetCurrentUserLazyQuery();
  
  // Utilisation de la souscription avec user.id
  const { data: dataSubscription } = useGetCurrentUserSubscription(user?.auth?.id);

  const currentUserData = dataSubscription?.currentUserUpdated || dataQuery?.currentUser;

  useEffect(() => {
    if (initialToken && initialLifeTime && Date.now() < initialLifeTime) {
      loadCurrentUser();
    } else {
      setIsDataLoaded(true);
    }
  }, [initialToken, initialLifeTime, loadCurrentUser]);

  useEffect(() => {
    if (currentUserData) {
      const userData = {
        isAuth: true,
        auth: currentUserData,
      };
      setUser(userData);
      Cookies.set("currentUser", JSON.stringify(userData), { expires: 1 });
      setIsDataLoaded(true);
    } else if (error) {
      Cookies.remove("token");
      Cookies.remove("lifeTime");
      Cookies.remove("currentUser");
      setUser({ isAuth: false, auth: null });
      setIsDataLoaded(true);
    }
  }, [currentUserData, error]);

  useEffect(() => {
    if (!initialToken || Date.now() >= initialLifeTime) {
      Cookies.remove("token");
      Cookies.remove("lifeTime");
      Cookies.remove("currentUser");
      setUser({ isAuth: false, auth: null });
      setIsDataLoaded(true);
    }
  }, [initialToken, initialLifeTime]);

  if (!isDataLoaded) return null;

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
