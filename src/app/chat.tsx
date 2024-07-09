"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useChat } from "ai/react";
import { Bot, Send, User } from "lucide-react";
import { useEffect, useRef } from "react";

export default function Chat() {
  const scrollableRef = useRef<HTMLDivElement>(null);
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
    });

  useEffect(() => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <Card className="h-screen bg-background p-4 m-0 flex flex-col">
      <CardHeader>
        <CardTitle>Gemma Prompt</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col backdrop-blur-lg rounded-lg shadow-lg p-6 grow w-full max-w-full">
        <ul className="flex flex-col space-y-4 mb-4 overflow-y-scroll no-scrollbar grow">
          {messages.map((m, index) => (
            <li
              key={index}
              className={`p-3 rounded-lg flex gap-4 items-center ${
                m.role === "user" ? "self-end min-w-2/3" : "w-2/3"
              }`}
            >
              <Bot className={cn(m.role === "user" && "hidden")} />
              <div
                className={`p-3 rounded-lg ${
                  m.role === "user"
                    ? "bg-primary text-background self-end min-w-2/3"
                    : "bg-secondary w-2/3"
                }`}
              >
                {m.content}
              </div>
              <User className={cn(m.role !== "user" && "hidden")} />
            </li>
          ))}
          <div ref={scrollableRef} className="-mt-8" />
        </ul>

        <form
          onSubmit={handleSubmit}
          className="flex items-center space-x-2 justify-self-end"
        >
          <Input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Ask your question"
            className="flex-grow p-2 rounded-lg"
            disabled={isLoading}
          />
          <Button
            type="submit"
            className={cn("absolute right-6 p-4")}
            disabled={isLoading}
            variant={"ghost"}
          >
            <Send size={20} />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
