"use client";

import { AutosizeTextarea } from "@/components/ui/autoResizeTextArea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useChat } from "ai/react";
import { Bot, Send, User } from "lucide-react";
import { useEffect, useRef } from "react";

export default function Chat() {
  const scrollableRef = useRef<HTMLLIElement>(null);
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
    <Card className="">
      <CardHeader>
        <CardTitle>Gemma Prompt</CardTitle>
      </CardHeader>
      <CardContent className="pb-0 flex flex-col h-full">
        <ul className="space-y-6 h-[80vh] overflow-y-scroll no-scrollbar pb-3">
          {messages.map((message, index) => (
            <li
              key={index}
              className={cn(
                "flex w-full",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
              ref={scrollableRef}
            >
              <div className={cn("flex gap-4 max-w-3xl")}>
                <div>
                  {message.role !== "user" && <Bot className="size-6" />}
                </div>
                <div
                  className={cn(
                    "rounded-lg p-2 px-4 text-pretty",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary"
                  )}
                >
                  {message.content}
                </div>
                <div>
                  {message.role === "user" && <User className="size-6" />}
                </div>
              </div>
            </li>
          ))}
        </ul>
        <form
          className="flex gap-2 sticky bottom-0 bg-white p-4 pt-0"
          onSubmit={handleSubmit}
        >
          <AutosizeTextarea
            className="resize-none no-scrollbar h-10 pr-8 text-pretty"
            placeholder="Ask me anything..."
            value={input}
            minHeight={40}
            maxHeight={200}
            onChange={handleInputChange}
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <Button
            type="submit"
            className="absolute right-4"
            disabled={isLoading}
            variant={"ghost"}
          >
            <Send className="size-5" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
