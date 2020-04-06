import { useRouter } from "next/router";
export const useFlags = (): Record<string, string | boolean> => {
  const router = useRouter();
  const debug: boolean = !!router?.query?.debug;
  return { debug };
};
