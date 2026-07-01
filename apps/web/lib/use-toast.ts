"use client";

import * as React from "react";

type ToastActionElement = React.ReactElement<any>;
export interface Toast {
  open?: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  variant?: "default" | "destructive";
  id?: string;
}

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

interface ToastState {
  toasts: Toast[];
}

type ToastActionType = "ADD_TOAST" | "UPDATE_TOAST" | "REMOVE_TOAST";

interface ToastAction {
  type: ToastActionType;
  toast?: Toast;
}

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

export const useToast = () => {
  const [state, dispatch] = React.useReducer(toastReducer, {
    toasts: [],
  });

  const removeToast = React.useCallback((toast?: Toast) => {
    dispatch({ type: "REMOVE_TOAST", toast });
  }, []);

  const dismissToast = React.useCallback(
    (toast?: Toast) => {
      setTimeout(() => {
        removeToast(toast);
      }, TOAST_REMOVE_DELAY);
    },
    [removeToast],
  );

  const addToast = React.useCallback(
    (props: Toast) => {
      const id = genId();
      const toast = { ...props, id };

      dispatch({
        type: "ADD_TOAST",
        toast,
      });

      return {
        id,
        dismiss: () => dismissToast(toast),
        update: (props: Toast) =>
          dispatch({ type: "UPDATE_TOAST", toast: { ...props, id } }),
      };
    },
    [dismissToast],
  );

  return { toast: addToast, toasts: state.toasts };
};

function toastReducer(state: ToastState, action: ToastAction): ToastState {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast!, ...state.toasts].slice(0, TOAST_LIMIT),
      };
    case "REMOVE_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toast?.id),
      };
    default:
      return state;
  }
}
