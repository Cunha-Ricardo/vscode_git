
import React, { createContext, useState, useContext, useEffect } from "react";
import { users as initialUsers, UserType, ProfileType, profiles as initialProfiles } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type AuthContextType = {
  user: UserType | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  userProfile: ProfileType | null;
  updateUsers: (updatedUsers: UserType[]) => void;
  updateProfiles: (updatedProfiles: ProfileType[]) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [userProfile, setUserProfile] = useState<ProfileType | null>(null);
  const [allUsers, setAllUsers] = useState<UserType[]>([]);
  const [allProfiles, setAllProfiles] = useState<ProfileType[]>([]);
  
  const isAuthenticated = !!user;

  // On mount, check for stored user and data
  useEffect(() => {
    // Load users
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      setAllUsers(JSON.parse(storedUsers) as UserType[]);
    } else {
      setAllUsers(initialUsers);
      localStorage.setItem("users", JSON.stringify(initialUsers));
    }
    
    // Load profiles
    const storedProfiles = localStorage.getItem("profiles");
    if (storedProfiles) {
      setAllProfiles(JSON.parse(storedProfiles) as ProfileType[]);
    } else {
      setAllProfiles(initialProfiles);
      localStorage.setItem("profiles", JSON.stringify(initialProfiles));
    }
    
    // Load logged-in user
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser) as UserType;
      setUser(parsedUser);
      
      // Find and set the user's profile
      const storedProfiles = localStorage.getItem("profiles");
      if (storedProfiles) {
        const profiles = JSON.parse(storedProfiles) as ProfileType[];
        const profile = profiles.find(p => p.name === parsedUser.profile);
        if (profile) {
          setUserProfile(profile);
        }
      } else {
        const profile = initialProfiles.find(p => p.name === parsedUser.profile);
        if (profile) {
          setUserProfile(profile);
        }
      }
    }
  }, []);

  const updateUsers = (updatedUsers: UserType[]) => {
    setAllUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    
    // If current user was updated, update that too
    if (user) {
      const updatedUser = updatedUsers.find(u => u.id === user.id);
      if (updatedUser) {
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    }
  };
  
  const updateProfiles = (updatedProfiles: ProfileType[]) => {
    setAllProfiles(updatedProfiles);
    localStorage.setItem("profiles", JSON.stringify(updatedProfiles));
    
    // If current user's profile was updated, update that too
    if (user && userProfile) {
      const updatedProfile = updatedProfiles.find(p => p.name === userProfile.name);
      if (updatedProfile) {
        setUserProfile(updatedProfile);
      }
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Get the latest users from localStorage
    const storedUsers = localStorage.getItem("users");
    const currentUsers = storedUsers ? JSON.parse(storedUsers) as UserType[] : allUsers;
    
    const foundUser = currentUsers.find(
      (u) => u.email === email && u.password === password && u.status === "ATIVO"
    );

    if (foundUser) {
      setUser(foundUser);
      
      // Get latest profiles from localStorage
      const storedProfiles = localStorage.getItem("profiles");
      const currentProfiles = storedProfiles ? JSON.parse(storedProfiles) as ProfileType[] : allProfiles;
      
      // Find and set the user's profile
      const profile = currentProfiles.find(p => p.name === foundUser.profile);
      if (profile) {
        setUserProfile(profile);
      }
      
      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(foundUser));
      
      toast.success(`Bem-vindo, ${foundUser.name}!`);
      return true;
    } else {
      toast.error("Email ou senha inválidos");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setUserProfile(null);
    localStorage.removeItem("user");
    toast.info("Você foi desconectado");
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated, 
      userProfile,
      updateUsers,
      updateProfiles
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
