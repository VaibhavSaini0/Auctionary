"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useUser as useClerkUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase/client";

// Matches your SQL schema exactly
export type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
  current_balance: number | null;
  bidded_ammount: number | null;
};

interface UserContextType {
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { user: clerkUser, isLoaded: clerkLoaded } = useClerkUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fetchingProfile, setFetchingProfile] = useState(false);

  const fetchSupabaseProfile = async (userId: string) => {
    setFetchingProfile(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.warn("Profile not found in Supabase for Clerk ID:", userId);
        setProfile(null);
      } else {
        setProfile(data);
      }
    } catch (err) {
      console.error("Critical error fetching profile:", err);
    } finally {
      setFetchingProfile(false);
    }
  };

  useEffect(() => {
    if (clerkLoaded) {
      if (clerkUser) {
        fetchSupabaseProfile(clerkUser.id);
      } else {
        setProfile(null);
        setFetchingProfile(false);
      }
    }
  }, [clerkUser, clerkLoaded]);

  const value = {
    profile,
    loading: !clerkLoaded || fetchingProfile,
    refreshProfile: async () => {
      if (clerkUser) await fetchSupabaseProfile(clerkUser.id);
    },
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
export const useUserDetails = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserDetails must be used within a UserProvider");
  }
  return context;
};