/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import StepsList from "../components/StepsList";
import { useWebContainer } from "../hooks/useWebContainer";
import { Step } from "../types";

const Builder = () => {
  const location = useLocation();
  const { prompt } = location.state as { prompt: string };
  const [userPrompt, setPrompt] = useState("");
  const [llmMessages, setLlmMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [templateSet, setTemplateSet] = useState(false);
  const webcontainer = useWebContainer();

  const [currentStep, setCurrentStep] = useState(1);

  const [steps, setSteps] = useState<Step[]>([]);

  return (
    <div>
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-100">Website Builder</h1>
        <p className="text-sm text-gray-400 mt-1">Prompt: {prompt}</p>
      </header>
      <div className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-4 gap-6 p-6">
          <div className="col-span-1 space-y-6 overflow-auto">
            <div>
              <div className="max-h-[75vh] overflow-scroll">
                <StepsList
                  steps={steps}
                  currentStep={currentStep}
                  onStepClick={setCurrentStep}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Builder;
