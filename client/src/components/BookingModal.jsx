import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config';

export default function BookingModal({ mentor, onClose, onSuccess }) {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [bookedSlots, setBookedSlots] = useState([]);
    const [formData, setFormData] = useState({
        date: '',
        timeSlot: '', // Replaces startTime/endTime
        topic: '',
        notes: ''
    });

    // Generate hourly slots from 9 AM to 8 PM
    const generateTimeSlots = () => {
        const slots = [];
        for (let i = 9; i < 20; i++) {
            const start = i < 10 ? `0${i}:00` : `${i}:00`;
            const end = i + 1 < 10 ? `0${i + 1}:00` : `${i + 1}:00`;
            slots.push({ start, end, label: `${formatTime(start)} - ${formatTime(end)}` });
        }
        return slots;
    };

    const formatTime = (time) => {
        const [hour, minute] = time.split(':');
        const h = parseInt(hour);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const formattedHour = h % 12 || 12;
        return `${formattedHour}:${minute} ${ampm}`;
    };

    const timeSlots = generateTimeSlots();

    const fetchBookedSlots = async (date) => {
        try {
            const response = await fetch(`${API_URL}/api/session/mentor/${mentor._id}/booked-slots?date=${date}`, {
                headers: { 'auth-token': token }
            });
            if (response.ok) {
                const data = await response.json();
                setBookedSlots(data.map(session => session.startTime));
            }
        } catch (err) {
            console.error('Error fetching booked slots:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'date') {
            fetchBookedSlots(value);
            setFormData(prev => ({ ...prev, date: value, timeSlot: '' })); // Reset slot on date change
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Find selected slot to get start and end time
            const selectedSlot = timeSlots.find(slot => slot.start === formData.timeSlot);
            if (!selectedSlot) throw new Error('Please select a time slot');

            const response = await fetch(`${API_URL}/api/session/book`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                },
                body: JSON.stringify({
                    mentorId: mentor.userId._id,
                    date: formData.date,
                    startTime: selectedSlot.start,
                    endTime: selectedSlot.end,
                    topic: formData.topic,
                    notes: formData.notes
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to book session');
            }

            onSuccess(data);
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-[#111e22] border border-white/10 rounded-xl w-full max-w-md p-6 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-white text-xl font-bold">Book a Session</h2>
                    <button onClick={onClose} className="text-white/60 hover:text-white">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-white/60 text-sm mb-1">Date</label>
                        <input
                            type="date"
                            name="date"
                            required
                            min={new Date().toISOString().split('T')[0]}
                            value={formData.date}
                            onChange={handleChange}
                            style={{ colorScheme: 'dark' }}
                            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-white/60 text-sm mb-1">Time Slot (1 Hour)</label>
                        <select
                            name="timeSlot"
                            required
                            value={formData.timeSlot}
                            onChange={handleChange}
                            disabled={!formData.date}
                            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                        >
                            <option value="" className="bg-[#111e22]">Select a time slot</option>
                            {timeSlots.map((slot) => {
                                const isBooked = bookedSlots.includes(slot.start);

                                // Check if slot is in the past for today
                                let isPast = false;
                                if (formData.date) {
                                    const today = new Date();
                                    const selectedDate = new Date(formData.date);
                                    const isToday = selectedDate.toDateString() === today.toDateString();

                                    if (isToday) {
                                        const currentHour = today.getHours();
                                        const slotHour = parseInt(slot.start.split(':')[0]);
                                        if (slotHour <= currentHour) {
                                            isPast = true;
                                        }
                                    }
                                }

                                const isDisabled = isBooked || isPast;

                                return (
                                    <option
                                        key={slot.start}
                                        value={slot.start}
                                        disabled={isDisabled}
                                        className={`bg-[#111e22] ${isDisabled ? 'text-white/30' : ''} ${isBooked ? 'text-red-400' : ''}`}
                                    >
                                        {slot.label} {isBooked ? '(Booked)' : ''} {isPast ? '(Past)' : ''}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <div>
                        <label className="block text-white/60 text-sm mb-1">Topic</label>
                        <input
                            type="text"
                            name="topic"
                            required
                            placeholder="e.g., Career Advice, Code Review"
                            value={formData.topic}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-white/60 text-sm mb-1">Notes (Optional)</label>
                        <textarea
                            name="notes"
                            rows="3"
                            placeholder="Any specific questions or context..."
                            value={formData.notes}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 rounded-lg bg-primary text-background-dark font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Booking...' : 'Confirm Booking'}
                    </button>
                </form>
            </div>
        </div>
    );
}
