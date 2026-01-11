import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function Checklist({ items, onToggle, completedItems }) {
    if (!items || items.length === 0) return null;

    return (
        <div className="space-y-3">
            {items.map((item, index) => {
                const isCompleted = completedItems?.includes(item.id);

                return (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => onToggle(item.id)}
                        className={cn(
                            "flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300 border border-transparent group",
                            isCompleted
                                ? "bg-green-500/10 border-green-500/20"
                                : "bg-white/5 hover:bg-white/10 border-white/5"
                        )}
                    >
                        <div className={cn(
                            "p-2 rounded-full mr-4 transition-colors",
                            isCompleted ? "text-green-400" : "text-white/40 group-hover:text-white/70"
                        )}>
                            {isCompleted ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                        </div>
                        <div className="flex-1">
                            <h3 className={cn(
                                "font-medium text-lg transition-all",
                                isCompleted ? "text-green-100 line-through opacity-70" : "text-white"
                            )}>
                                {item.label}
                            </h3>
                            {item.type === 'timer' && (
                                <p className="text-xs text-indigo-300 mt-1">Timer required: {item.duration}m</p>
                            )}
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
