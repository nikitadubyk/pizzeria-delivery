"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { useGetSuperAdminMeQuery } from "@/store/api/super-admin.api";
import { ROUTES } from "@/config/routes";
import {
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  saveUser,
} from "@/store/auth/auth-storage";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearAuthUser,
  selectAuthUser,
  setAuthUser,
} from "@/store/slices/auth.slice";

type SuperAdminAuthGuardProps = {
  children: ReactNode;
};

export const SuperAdminAuthGuard = ({ children }: SuperAdminAuthGuardProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  useAppSelector(selectAuthUser);
  const hasSessionToken = Boolean(getAccessToken() || getRefreshToken());
  const {
    data: user,
    error,
    isError,
    isFetching,
    isSuccess,
  } = useGetSuperAdminMeQuery(undefined, {
    refetchOnMountOrArgChange: true,
    skip: !hasSessionToken,
  });
  const isUnauthorized =
    isError && error !== undefined && "status" in error && error.status === 401;

  useEffect(() => {
    if (!hasSessionToken) {
      clearAuthSession();
      dispatch(clearAuthUser());
      router.replace(ROUTES.SUPER_ADMIN.LOGIN);
    }
  }, [dispatch, hasSessionToken, router]);

  useEffect(() => {
    if (isUnauthorized && !isFetching) {
      clearAuthSession();
      dispatch(clearAuthUser());
      router.replace(ROUTES.SUPER_ADMIN.LOGIN);
    }
  }, [dispatch, isFetching, isUnauthorized, router]);

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
