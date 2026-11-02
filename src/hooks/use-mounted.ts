"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * Returns false during SSR and the hydration render, then true on the client.
 * Use it to defer theme-dependent state until after hydration.
 */
export function useMounted() {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}
