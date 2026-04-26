"use client";
import { useState, useCallback } from "react";

export function useMultiStep(steps, validators = {}) {
  const [step,   setStep]   = useState(0);
  const [errors, setErrors] = useState({});

  const validate = useCallback((stepIndex) => {
    const fn = validators[stepIndex];
    if (!fn) return true;
    const result = fn();
    if (result === true) { setErrors(e => ({ ...e, [stepIndex]: null })); return true; }
    setErrors(e => ({ ...e, [stepIndex]: result }));
    return false;
  }, [validators]);

  const next = useCallback(() => {
    if (!validate(step)) return false;
    setStep(s => Math.min(s + 1, steps.length - 1));
    return true;
  }, [step, steps.length, validate]);

  const back = useCallback(() => {
    setStep(s => Math.max(s - 1, 0));
  }, []);

  const goTo = useCallback((index) => {
    setStep(Math.max(0, Math.min(index, steps.length - 1)));
  }, [steps.length]);

  const reset = useCallback(() => {
    setStep(0);
    setErrors({});
  }, []);

  return {
    step,
    stepName:  steps[step],
    steps,
    isFirst:   step === 0,
    isLast:    step === steps.length - 1,
    error:     errors[step] || null,
    next, back, goTo, reset,
    progress:  Math.round(((step) / (steps.length - 1)) * 100),
  };
}