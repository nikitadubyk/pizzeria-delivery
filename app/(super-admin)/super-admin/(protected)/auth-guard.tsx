"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import { useGetSuperAdminMeQuery } from "@/store/api/super-admin.api";
import { ROUTES } from "@/config/routes";
import {
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  saveUser,
} from "@/store/auth/auth-storage";
import { useAppDispatch } from "@/store/hooks";
import { clearAuthUser, setAuthUser } from "@/store/slices/auth.slice";

type SuperAdminAuthGuardProps = {
  children: ReactNode;
};

export const SuperAdminAuthGuard = ({ children }: SuperAdminAuthGuardProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [hasSessionToken] = useState(() =>
    Boolean(getAccessToken() || getRefreshToken()),
  );
  const {
    data: user,
    isError,
    isSuccess,
  } = useGetSuperAdminMeQuery(undefined, {
    refetchOnMountOrArgChange: true,
    skip: !hasSessionToken,
  });

  useEffect(() => {
    if (!hasSessionToken) {
      clearAuthSession();
      dispatch(clearAuthUser());
      router.replace(ROUTES.SUPER_ADMIN.LOGIN);
    }
  }, [dispatch, hasSessionToken, router]);

  useEffect(() => {
    if (isError) {
      clearAuthSession();
      dispatch(clearAuthUser());
      router.replace(ROUTES.SUPER_ADMIN.LOGIN);
    }
  }, [dispatch, isError, router]);

  useEffect(() => {
    if (user) {
      saveUser(user);
      dispatch(setAuthUser(user));
    }
  }, [dispatch, user]);

  if (!hasSessionToken || !isSuccess) {
    return null;
  }

  return children;
};
