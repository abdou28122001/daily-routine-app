import React, { useState, useEffect } from 'react';
import { SCHEDULE, formatTime } from '@/lib/constants';
import { Checklist } from '@/components/Checklist';
import { AlienAssistant } from '@/components/AlienAssistant';
import { motion } from 'framer-motion';
import { Brain, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

export default function Dashboard() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [currentBlock, setCurrentBlock] = useState(null);
    const [isAlienOpen, setIsAlienOpen] = useState(false);
    const [completedItems, setCompletedItems] = useState(() => {
        const saved = localStorage.getItem('daily_completed');
        return saved ? JSON.parse(saved) : [];
    });

    // Clock Update
    useEffect(() => {
        const interval = setInterval(() => setCurrentTime(new Date()), 1000 * 60); // Every minute
        return () => clearInterval(interval);
    }, []);

    // Determine current block
    useEffect(() => {
        const hour = currentTime.getHours();
        const block = SCHEDULE.find(b => {
            const [start, end] = b.timeRange.split(' - ').map(t => parseInt(t.split(':')[0]));
            // Handle overnight (23 - 06)
            if (start > end) {
                return hour >= start || hour < end;
            }
            return hour >= start && hour < end;
        });
        setCurrentBlock(block || SCHEDULE[0]); // Default to first if whatever
    }, [currentTime]);

    // Persist
    useEffect(() => {
        localStorage.setItem('daily_completed', JSON.stringify(completedItems));
    }, [completedItems]);

    // Reminders
    useEffect(() => {
        if ('Notification' in window && Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    }, []);

    useEffect(() => {
        if (currentBlock && 'Notification' in window && Notification.permission === 'granted') {
            new Notification(`It's time for: ${currentBlock.label}`, {
                body: `Focus on: ${currentBlock.checklists.map(c => c.label).join(', ')}`,
                icon: '/pwa-192x192.png'
            });
        }
    }, [currentBlock]);

    const handleToggle = (id) => {
        setCompletedItems(prev => {
            const isDone = prev.includes(id);
            if (isDone) {
                return prev.filter(i => i !== id);
            }
            const newItems = [...prev, id];
            // Check if all items in current block are done?
            if (currentBlock && currentBlock.checklists.every(item => item.id === id || newItems.includes(item.id))) {
                toast.success('Block Completed! Review your progress with the Alien.', { icon: '👽' });
            }
            return newItems;
        });
    };

    if (!currentBlock) return <div className="text-white">Loading...</div>;

    return (
        <div className={`min-h-screen p-6 transition-all duration-1000 bg-gradient-to-br ${currentBlock.color}`}>
            <div className="max-w-md mx-auto relative z-10 space-y-8 pb-20">

                {/* Header */}
                <header className="flex justify-between items-start pt-6">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">{format(currentTime, 'EEEE')}</h1>
                        <p className="text-white/80 text-xl">{format(currentTime, 'MMMM do, yyyy')}</p>
                    </div>
                    <div className="glass px-4 py-2 rounded-full flex items-center gap-2 text-white">
                        <Clock size={16} />
                        <span className="font-mono">{formatTime(currentTime)}</span>
                    </div>
                </header>

                {/* Current Block Card */}
                <motion.div
                    key={currentBlock.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-6 rounded-3xl text-white"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-white/20 rounded-xl">
                            <currentBlock.icon size={32} />
                        </div>
                        <div>
                            <p className="text-sm text-white/60 uppercase tracking-wider">Now Active</p>
                            <h2 className="text-2xl font-bold">{currentBlock.label}</h2>
                            <p className="text-sm text-white/80 mt-1">{currentBlock.timeRange}</p>
                        </div>
                    </div>

                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-6">
                        <div
                            className="h-full bg-white transition-all duration-500"
                            style={{
                                width: `${(completedItems.filter(i => currentBlock.checklists.find(c => c.id === i)).length / currentBlock.checklists.length) * 100}%`
                            }}
                        />
                    </div>

                    <Checklist
                        items={currentBlock.checklists}
                        completedItems={completedItems}
                        onToggle={handleToggle}
                    />
                </motion.div>

                {/* Next Up (Preview) */}
                {/* Can implement later */}

                {/* Alien Assistant Trigger */}
                <button
                    className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-600 rounded-full shadow-2xl flex items-center justify-center animate-bounce hover:scale-110 transition-transform z-50 group"
                    onClick={() => setIsAlienOpen(!isAlienOpen)}
                >
                    <Brain size={32} className="text-white group-hover:rotate-12 transition-transform" />
                </button>

                <AlienAssistant
                    isOpen={isAlienOpen}
                    onClose={() => setIsAlienOpen(false)}
                    currentContext={{ currentBlock, completedItems }}
                />
            </div>
        </div>
    );
}
