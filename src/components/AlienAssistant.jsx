import React, { useState, useEffect, useRef } from 'react';
import { groq, ALIEN_SYSTEM_PROMPT } from '@/lib/groq';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot } from 'lucide-react';

export function AlienAssistant({ isOpen, onClose, currentContext }) {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Greetings, Earthling! 👽 How is your research going today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const completion = await groq.chat.completions.create({
                messages: [
                    { role: 'system', content: ALIEN_SYSTEM_PROMPT + `\nCurrent Context: ${JSON.stringify(currentContext)}` },
                    ...messages,
                    userMsg
                ],
                model: "llama3-8b-8192",
            });

            const alienMsg = completion.choices[0]?.message?.content || "Transmission interrupted... 🛸";
            setMessages(prev => [...prev, { role: 'assistant', content: alienMsg }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Error contacting the mothership. Try again later." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="fixed bottom-24 right-6 w-80 md:w-96 h-[500px] glass-card rounded-2xl flex flex-col overflow-hidden z-50 shadow-2xl border border-green-500/30"
                >
                    {/* Header */}
                    <div className="p-4 bg-green-500/20 flex justify-between items-center border-b border-green-500/20">
                        <div className="flex items-center gap-2">
                            <Bot className="text-green-400" />
                            <h3 className="font-bold text-green-100">Alien Guide</h3>
                        </div>
                        <button onClick={onClose} className="text-white/60 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex \${ msg.role === 'user' ? 'justify-end' : 'justify-start' }`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-white/10 text-gray-100 rounded-bl-none'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white/10 p-3 rounded-2xl rounded-bl-none">
                                    <span className="animate-pulse">Thinking... 🛸</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-black/20 border-t border-white/5">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask for advice..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-green-500/50"
                            />
                            <button
                                onClick={handleSend}
                                disabled={loading}
                                className="bg-green-600 hover:bg-green-500 text-white p-2 rounded-xl transition-colors disabled:opacity-50"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
