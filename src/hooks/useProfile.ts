import { profile, type Profile } from "@/api/auth";
import { useQuery } from "@tanstack/react-query";

export const useFetchProfile = () => {
  return useQuery<Profile, Error>({
    queryKey: ["profile"],
    queryFn: profile,
    staleTime: 1000 * 60 * 5,
  });
};
