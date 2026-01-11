import { CloudMoon, Coffee, Briefcase, Moon, Activity, Sun } from 'lucide-react';

export const SCHEDULE = [
    {
        id: 'morning',
        label: 'Morning Routine',
        timeRange: '06:00 - 09:00',
        icon: Sun,
        color: 'from-orange-400 to-yellow-300',
        checklists: [
            { id: 'footing', label: 'Wake Up & Footing (30m)' },
            { id: 'shower', label: 'Shower (30m)' },
            { id: 'breakfast', label: 'Breakfast (30m)' },
            { id: 'lunch_prep', label: 'Lunch Preparation (30m)' },
            { id: 'commute', label: 'Road to Work (30m)' },
        ]
    },
    {
        id: 'deep_work_1',
        label: 'Deep Work Session 1',
        timeRange: '09:00 - 14:00',
        icon: Briefcase,
        color: 'from-blue-500 to-indigo-500',
        checklists: [
            { id: 'reading', label: 'Reading (3H)', type: 'timer', duration: 180 }, // 3 hours
            { id: 'lunch', label: 'Lunch (1H)' },
            { id: 'swimming', label: 'Swimming (1H)' },
        ]
    },
    {
        id: 'deep_work_2',
        label: 'Deep Work Session 2',
        timeRange: '14:00 - 19:00',
        icon: Activity,
        color: 'from-indigo-600 to-purple-600',
        checklists: [
            { id: 'work_focus', label: 'Work (5H)', type: 'timer', duration: 300 }, // 5 hours
        ]
    },
    {
        id: 'evening',
        label: 'Health & Relax',
        timeRange: '19:00 - 23:00',
        icon: CloudMoon,
        color: 'from-purple-500 to-pink-500',
        checklists: [
            { id: 'health_care', label: 'Health Care (4H)' },
        ]
    },
    {
        id: 'sleep',
        label: 'Sleep',
        timeRange: '23:00 - 06:00',
        icon: Moon,
        color: 'from-slate-800 to-slate-900',
        checklists: [
            { id: 'sleep_check', label: 'Sleeping (7H)' }
        ]
    }
];

export const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
