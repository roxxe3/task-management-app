import { useState, useEffect, useRef } from 'react';

const useProgressAnimation = (targetPercentage) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const animationTimerRef = useRef(null);
  const prevTargetRef = useRef(targetPercentage);

  useEffect(() => {
    // Don't animate if there's no change
    if (prevTargetRef.current === targetPercentage) {
      return;
    }
    
    // Update the ref to track the latest target
    prevTargetRef.current = targetPercentage;
    
    // Clear any existing animation timer
    if (animationTimerRef.current) {
      clearInterval(animationTimerRef.current);
    }
    
    // Define animation parameters
    const startValue = animatedPercentage;
    const endValue = targetPercentage;
    const duration = 800; // slightly faster for better responsiveness
    const totalSteps = 30; // fewer steps for smoother transition
    const stepDuration = duration / totalSteps;
    let currentStep = 0;
    
    // Use easeOutQuad easing function for smoother animation
    const easeOutQuad = (t) => t * (2 - t);

    // Start animation
    animationTimerRef.current = setInterval(() => {
      currentStep++;
      
      if (currentStep >= totalSteps) {
        setAnimatedPercentage(endValue);
        clearInterval(animationTimerRef.current);
        return;
      }
      
      // Calculate current progress with easing
      const progress = easeOutQuad(currentStep / totalSteps);
      // Calculate the current value
      const currentValue = startValue + (endValue - startValue) * progress;
      
      setAnimatedPercentage(currentValue);
    }, stepDuration);
    
    // Clean up animation timer on unmount or when dependencies change
    return () => {
      if (animationTimerRef.current) {
        clearInterval(animationTimerRef.current);
      }
    };
  }, [targetPercentage]); // Only depend on targetPercentage, not animatedPercentage

  return animatedPercentage;
};

export default useProgressAnimation; 