"use client";

import { listPublishedBlogs } from "@/app/actions/blogs";
import { submitEnquiry, type EnquiryInput } from "@/app/actions/enquiries";
import { getVisibleOffer } from "@/app/actions/offers";
import { listPublishedServices } from "@/app/actions/services";
import { useMutation, useQuery } from "@tanstack/react-query";

export const publicQueryKeys = {
  services: ["published-services"] as const,
  blogs: ["published-blogs"] as const,
  offer: ["visible-offer"] as const,
};

export function usePublishedServices() {
  return useQuery({
    queryKey: publicQueryKeys.services,
    queryFn: () => listPublishedServices(),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}

export function usePublishedBlogs() {
  return useQuery({
    queryKey: publicQueryKeys.blogs,
    queryFn: () => listPublishedBlogs(),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}

export function useVisibleOffer() {
  return useQuery({
    queryKey: publicQueryKeys.offer,
    queryFn: getVisibleOffer,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}

export function useSubmitEnquiry() {
  return useMutation({
    mutationFn: (input: EnquiryInput) => submitEnquiry(input),
  });
}
