'use client';

import React from 'react';

interface ProgressIndicatorProps {
  steps: string[];
  currentStep: number;
}

export default function ProgressIndicator({
  steps,
  currentStep,
}: ProgressIndicatorProps) {
  return (
    <div className="progress-indicator" role="progressbar" aria-valuenow={currentStep + 1} aria-valuemin={1} aria-valuemax={steps.length} aria-label={`Step ${currentStep + 1} of ${steps.length}: ${steps[currentStep]}`}>
      <div className="progress-steps">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const stepClass = [
            'progress-step',
            isCompleted ? 'progress-step--completed' : '',
            isActive ? 'progress-step--active' : '',
          ].filter(Boolean).join(' ');

          return (
            <div key={step} className={stepClass}>
              <div className="progress-step-dot">
                {isCompleted ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2.5 6L5 8.5L9.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <span className="progress-step-num">{index + 1}</span>
                )}
              </div>
              <span className="progress-step-label">{step}</span>
            </div>
          );
        })}
      </div>
      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}
