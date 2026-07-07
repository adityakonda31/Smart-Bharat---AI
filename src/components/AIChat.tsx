import React, { useState, useEffect, useRef } from "react";
import { Send, Mic, MicOff, Sparkles, FileText, Volume2, VolumeX, User, HelpCircle, Upload, Image } from "lucide-react";
import { useSpeech } from "../context/SpeechContext";
import { useLanguage } from "../context/LanguageContext";

interface Message {
  sender: "user" | "assistant";
  text: string;
  attachment?: {
    name: string;
    type: "image" | "pdf";
  };
}

export const AIChat: React.FC = () => {
  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening, 
    speak, 
    cancelSpeak, 
    isSpeaking 
  } = useSpeech();

  const { t, translateDynamic } = useLanguage();

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "assistant",
      text: "Namaste! I am your AI Civic Companion. How can I assist you today? You can ask me about regional schemes, help auto-fill forms, audit document scans, or tag civic complaints. Feel free to speak or type."
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [attachment, setAttachment] = useState<{ name: string; type: "image" | "pdf" } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "How to apply for passport?",
    "Which schemes am I eligible for?",
    "Road outside my house is damaged.",
    "Explain Aadhaar card renewal rules."
  ];

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Sync vocal transcript into input bar
  useEffect(() => {
    if (transcript) {
      setInputText(transcript);
    }
  }, [transcript]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() && !attachment) return;

    const userMsg: Message = {
      sender: "user",
      text: textToSend,
      attachment: attachment || undefined
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setAttachment(null);
    setLoading(true);

    // Simulate AI pipeline query
    await new Promise((resolve) => setTimeout(resolve, 1500));

    let responseText = "I can definitely help you with that! Could you provide additional documents or details so I can match it exactly?";
    const query = textToSend.toLowerCase();

    if (query.includes("passport")) {
      responseText = "To apply for an Indian Passport, you need:\n1. **Proof of Identity**: Aadhaar Card or PAN Card.\n2. **Proof of Address**: Electricity/water bill or bank statement.\n3. **Educational Marksheet**: For Non-ECR status registration.\n\nYou should submit the application on the official site **passportindia.gov.in** and book a slot at the nearest PSK. Would you like me to guide you on booking a slot?";
    } else if (query.includes("scheme") || query.includes("eligible")) {
      responseText = "Based on your demographic dashboard profile (Rahul Sharma, Age 21, Student, income ₹1.8 Lakh):\nYou match **90% odds** for the **Central Sector Scheme of Scholarship** (offers ₹12,000/yr) and **85% odds** for **PM Awas Yojana (PMAY-G)**.\n\nGo to the **Scheme Portal** tab in the sidebar to review and apply directly.";
    } else if (query.includes("road") || query.includes("damaged") || query.includes("pothole") || query.includes("street light") || query.includes("garbage")) {
      responseText = "I see there's a civic grievance to report. I have prepared the parameters:\n- **Category**: Infrastructure repairs\n- **Department**: Public Works Department (PWD)\n- **Priority**: HIGH\n\nYou can head over to the **Complaint Desk** tab in the sidebar to review and lodge the complaint officially with automated timeline tracking updates.";
    } else if (query.includes("aadhaar") || query.includes("lost")) {
      responseText = "If you lost your Aadhaar card, do not worry:\n1. Retrieve your Aadhaar number (UID) or Enrolment ID online via **myaadhaar.uidai.gov.in** using your registered mobile number.\n2. Download a digital **e-Aadhaar PDF** instantly. It holds the same legal validity.\n3. Alternatively, order a reprint plastic PVC card online for a minor charge of ₹50.";
    }

    const aiMsg: Message = {
      sender: "assistant",
      text: responseText
    };

    setMessages((prev) => [...prev, aiMsg]);
    setLoading(false);

    // Auto vocalize response if desired
    speak(responseText);
  };

  return (
    <div className="glass-panel flex flex-col h-[calc(100vh-6rem)] rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm bg-white">
      
      {/* Header bar info */}
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-accent to-secondary flex items-center justify-center shadow-md shadow-accent/10">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold font-space text-slate-800 tracking-wider flex items-center gap-1.5">
              {t("navAIAssistant").toUpperCase()}
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            </h2>
            <p className="text-[10px] text-slate-500 font-poppins">
              {translateDynamic("RAG & Translation Pipeline Active")}
            </p>
          </div>
        </div>

        {/* TTS Toggle indicator */}
        <button
          onClick={isSpeaking ? cancelSpeak : () => speak(messages[messages.length - 1]?.text || "")}
          className={`
            p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-semibold font-poppins
            ${isSpeaking 
              ? "bg-accent/10 border-accent/20 text-accent animate-pulse" 
              : "bg-white border-slate-200 text-slate-500 hover:text-slate-800"}
          `}
          title={isSpeaking ? "Mute Assistant" : "Read Last Response"}
        >
          {isSpeaking ? (
            <>
              <Volume2 size={14} className="text-accent" />
              <span>{t("Speaking")}</span>
            </>
          ) : (
            <>
              <VolumeX size={14} />
              <span>{translateDynamic("Vocal Off")}</span>
            </>
          )}
        </button>
      </div>

      {/* Messages body stream */}
      <div 
        className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30"
        role="log"
        aria-live="polite"
        aria-label="Chat message history log"
      >
        {messages.map((msg, idx) => {
          const isUser = msg.sender === "user";
          return (
            <div 
              key={idx}
              className={`flex items-start space-x-3.5 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse space-x-reverse" : ""}`}
            >
              {/* Profile Avatar */}
              <div className={`
                h-8 w-8 rounded-lg flex items-center justify-center text-xs border shrink-0
                ${isUser 
                  ? "bg-primary/10 border-primary/20 text-primary" 
                  : "bg-accent/10 border-accent/20 text-accent"}
              `}>
                {isUser ? <User size={14} /> : <Sparkles size={14} />}
              </div>

              {/* Text cloud bubble */}
              <div className={`
                p-4 rounded-2xl text-xs leading-relaxed space-y-2 font-poppins shadow-sm
                ${isUser 
                  ? "bg-primary/10 border border-primary/15 text-slate-800 rounded-tr-none" 
                  : "bg-white border border-slate-200/60 text-slate-700 rounded-tl-none"}
              `}>
                <p className="whitespace-pre-line leading-relaxed">
                  {translateDynamic(msg.text)}
                </p>

                {/* Attachment Display */}
                {msg.attachment && (
                  <div className="mt-2 p-2 rounded-lg bg-slate-50 border border-slate-150 flex items-center space-x-2 text-[10px] text-slate-600">
                    <FileText size={12} className="text-secondary" />
                    <span className="truncate max-w-[150px]">{msg.attachment.name}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading shimmer indicator */}
        {loading && (
          <div className="flex items-start space-x-3.5 max-w-[60%]" aria-label="AI is composing response">
            <div className="h-8 w-8 rounded-lg bg-accent/10 border border-accent/20 text-accent flex items-center justify-center shrink-0">
              <Sparkles size={14} className="animate-spin" />
            </div>
            <div className="p-4 rounded-2xl rounded-tl-none bg-white border border-slate-150 text-slate-400 space-y-2 w-full shadow-sm">
              <div className="h-2 w-3/4 bg-slate-100 rounded skeleton-shimmer" />
              <div className="h-2 w-1/2 bg-slate-100 rounded skeleton-shimmer" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Voice wave HUD when listening */}
      {isListening && (
        <div 
          className="px-6 py-2 bg-accent/5 border-t border-accent/10 flex items-center justify-between animate-pulse"
          role="status"
          aria-live="assertive"
        >
          <div className="flex items-center space-x-3">
            <Mic className="text-accent animate-bounce" size={16} />
            <span className="text-xs text-slate-600 font-poppins">{translateDynamic("Listening... speak your request")}</span>
          </div>
          {/* Waves simulation bars */}
          <div className="flex items-center gap-1">
            <span className="h-3 w-1 bg-accent rounded animate-[pulse_1s_infinite_100ms]" />
            <span className="h-4.5 w-1 bg-accent rounded animate-[pulse_1s_infinite_200ms]" />
            <span className="h-3 w-1 bg-accent rounded animate-[pulse_1s_infinite_300ms]" />
            <span className="h-2 w-1 bg-accent rounded animate-[pulse_1s_infinite_400ms]" />
          </div>
        </div>
      )}

      {/* Suggestions Tray */}
      {messages.length === 1 && (
        <div className="px-6 py-3 border-t border-slate-150 bg-white">
          <p className="text-[10px] text-slate-400 font-poppins uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <HelpCircle size={10} /> {translateDynamic("Suggested Questions")}
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(sug)}
                className="text-[11px] bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 py-1.5 px-3 rounded-lg transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                aria-label={`Ask suggested query: ${sug}`}
              >
                {translateDynamic(sug)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input panel drawer */}
      <div className="p-4 border-t border-slate-150 bg-white">
        
        {/* Attachment preview */}
        {attachment && (
          <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl mb-3 border border-slate-200 text-xs">
            <div className="flex items-center space-x-2 text-slate-600">
              <Upload size={14} className="text-secondary" />
              <span className="truncate">{attachment.name}</span>
            </div>
            <button 
              onClick={() => setAttachment(null)} 
              className="text-danger hover:underline text-[10px]"
              aria-label="Remove attached file"
            >
              Remove
            </button>
          </div>
        )}

        <div className="flex items-center space-x-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
          
          {/* File attach simulated */}
          <div className="flex space-x-1.5">
            <button
              onClick={() => setAttachment({ name: "income_statement.pdf", type: "pdf" })}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              title="Attach Document (PDF)"
              aria-label="Attach mock income statement PDF"
            >
              <FileText size={16} />
            </button>
            <button
              onClick={() => setAttachment({ name: "damaged_road.png", type: "image" })}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              title="Attach Photo"
              aria-label="Attach mock photo of damaged road"
            >
              <Image size={16} />
            </button>
          </div>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={translateDynamic("Type or click the microphone to speak...")}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend(inputText);
            }}
            className="flex-1 bg-transparent border-none outline-none text-xs text-slate-800 placeholder-slate-400 focus:ring-0"
            aria-label="AI chatbot message text query input"
          />

          {/* Voice trigger */}
          <button
            onClick={isListening ? stopListening : startListening}
            className={`
              p-2 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none
              ${isListening 
                ? "bg-danger text-white animate-pulse" 
                : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"}
            `}
            title={isListening ? "Stop listening" : "Start speaking"}
            aria-label={isListening ? "Stop microphone recording" : "Record voice query"}
          >
            {isListening ? <MicOff size={16} /> : <Mic size={16} />}
          </button>

          {/* Send button */}
          <button
            onClick={() => handleSend(inputText)}
            disabled={!inputText.trim() && !attachment}
            className="p-2 rounded-lg bg-primary hover:bg-primary/95 text-white disabled:opacity-50 disabled:hover:bg-primary transition-all shadow-md shadow-primary/10 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            aria-label="Send query to AI"
          >
            <Send size={14} />
          </button>

        </div>
      </div>

    </div>
  );
};
