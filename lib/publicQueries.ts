"use client";

import { submitEnquiry, type EnquiryInput } from "@/app/actions/enquiries";
import { listPublishedFoods } from "@/app/actions/food";
import { getVisibleOffer } from "@/app/actions/offers";
import { listPublishedServices } from "@/app/actions/services";
import { useMutation, useQuery } from "@tanstack/react-query";

export const publicQueryKeys = {
  foods: ["published-foods"] as const,
  services: ["published-services"] as const,
  offer: ["visible-offer"] as const,
};

export function usePublishedFoods() {
  return useQuery({
    queryKey: publicQueryKeys.foods,
    queryFn: listPublishedFoods,
  });
}

export function usePublishedServices() {
  return useQuery({
    queryKey: publicQueryKeys.services,
    queryFn: listPublishedServices,
  });
}

export function useVisibleOffer() {
  return useQuery({
    queryKey: publicQueryKeys.offer,
    queryFn: getVisibleOffer,
  });
}

export function useSubmitEnquiry() {
  return useMutation({
    mutationFn: (input: EnquiryInput) => submitEnquiry(input),
  });
}
