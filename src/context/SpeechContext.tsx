import React, { createContext, useContext, useState, useEffect } from "react";

interface SpeechContextType {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  speak: (text: string, lang?: string) => void;
  cancelSpeak: () => void;
  isSpeaking: boolean;
  speechSupported: boolean;
}

const SpeechContext = createContext<SpeechContextType | undefined>(undefined);

// Define Speech Recognition type for TS
type SpeechRecognitionEvent = {
  resultIndex: number;
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
      isFinal: boolean;
    };
  };
};

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: { error: string }) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

export const SpeechProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognitionInstance | null>(null);
  const [speechSupported, setSpeechSupported] = useState(false);

  useEffect(() => {
    // Check Web Speech API support
    const SpeechRecognition = 
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const rec = new SpeechRecognition() as SpeechRecognitionInstance;
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = "en-IN"; // Default to English (India)
      
      rec.onstart = () => {
        setIsListening(true);
        setTranscript("");
      };
      
      rec.onresult = (event: any) => {
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            setTranscript(result[0].transcript);
          } else {
            interimTranscript += result[0].transcript;
          }
        }
      };
      
      rec.onerror = (e: { error: string }) => {
        console.error("Speech Recognition Error:", e);
        setIsListening(false);
      };
      
      rec.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(rec);
    }
  }, []);

  const startListening = () => {
    if (recognition) {
      try {
        recognition.start();
      } catch (e) {
        console.warn("Recognition already started or error: ", e);
      }
    } else {
      // Simulation fallback if not supported
      setIsListening(true);
      setTranscript("Simulating voice input...");
      const simulatedText = [
        "How to apply for passport?",
        "Show me agriculture schemes",
        "Road outside my house is broken",
        "Explain Aadhaar card eligibility"
      ];
      const randomPrompt = simulatedText[Math.floor(Math.random() * simulatedText.length)];
      setTimeout(() => {
        setTranscript(randomPrompt);
        setIsListening(false);
      }, 2500);
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    } else {
      setIsListening(false);
    }
  };

  const speak = (text: string, lang = "en-IN") => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel(); // Stop any active speech
      
      // Clean markdown tags out of the read text for clean voice synthesis
      const cleanText = text
        .replace(/[*#`_\-]/g, "")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // clean links
        .substring(0, 300); // truncate for speed

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = lang;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      // Try to match voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (v) => v.lang.includes(lang) || v.lang.includes("en-IN") || v.lang.includes("hi-IN")
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("Text-to-Speech not supported.");
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 2000);
    }
  };

  const cancelSpeak = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <SpeechContext.Provider
      value={{
        isListening,
        transcript,
        startListening,
        stopListening,
        speak,
        cancelSpeak,
        isSpeaking,
        speechSupported
      }}
    >
      {children}
    </SpeechContext.Provider>
  );
};

export const useSpeech = () => {
  const context = useContext(SpeechContext);
  if (!context) {
    throw new Error("useSpeech must be used within a SpeechProvider");
  }
  return context;
};
