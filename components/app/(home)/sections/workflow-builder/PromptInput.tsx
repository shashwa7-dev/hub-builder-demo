import React, { useState } from "react";
import { motion } from "framer-motion";
import { Smile, Camera, Mic, Send, SendHorizonal } from "lucide-react";
// shadcn/ui components (assumes your project has these components wired at the specified paths)
import { Button } from "@/components/ui/button";

// Simple, modern ChatGPT-like input box (dummy)
// Usage: import ChatInput from './ChatInput' and place <ChatInput onSend={(text) => {}} /> in your UI

export default function ChatInput({
  onSend,
}: {
  onSend?: (text: string) => void;
}) {
  const [value, setValue] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = () => {
    if (!value.trim()) return;
    setIsSending(true);

    // dummy behavior: call onSend if provided, then clear after small delay
    try {
      onSend?.(value.trim());
    } finally {
      setTimeout(() => {
        setValue("");
        setIsSending(false);
      }, 300);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 absolute bottom-10 left-1/4 z-10">
      <div className="bg-white/6 backdrop-blur-md border rounded-xl p-10 flex items-center gap-3 shadow-sm">
        <div className="flex-1">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="How can I help you?"
            className="resize-none w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground p-3 leading-5"
          />
        </div>

        <div className="flex items-center gap-2">
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleSend}
              disabled={!value.trim() || isSending}
              className="flex items-center gap-2 rounded-lg p-1 border"
            >
              <SendHorizonal className="w-15 h-15" />
            </Button>
          </motion.div>
        </div>
      </div>

      <p className="text-xs text-slate-400 mt-2 text-center">
        PlayStudio is currently in experimental mode.
      </p>
    </div>
  );
}
