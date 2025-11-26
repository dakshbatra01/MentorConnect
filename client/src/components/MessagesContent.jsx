import React, { useState } from 'react';

export default function MessagesContent() {
    const [activeConversation, setActiveConversation] = useState(null);

    const conversations = [
        {
            id: 1,
            name: 'Sarah Johnson',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
            lastMessage: 'See you tomorrow!',
            time: '10:30 AM',
            unread: 2
        },
        {
            id: 2,
            name: 'Michael Chen',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
            lastMessage: 'Thanks for the session',
            time: 'Yesterday',
            unread: 0
        }
    ];

    return (
        <div className="h-[calc(100vh-140px)] flex gap-6">
            {/* Conversations List */}
            <div className="w-80 flex flex-col bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-white/10">
                    <h2 className="text-white font-bold text-lg">Messages</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {conversations.map((conv) => (
                        <div
                            key={conv.id}
                            onClick={() => setActiveConversation(conv)}
                            className={`p-3 rounded-lg cursor-pointer transition-colors flex items-center gap-3 ${activeConversation?.id === conv.id
                                    ? 'bg-primary/20 border border-primary/30'
                                    : 'hover:bg-white/5 border border-transparent'
                                }`}
                        >
                            <div className="relative">
                                <div
                                    className="size-10 rounded-full bg-cover bg-center"
                                    style={{ backgroundImage: `url('${conv.avatar}')` }}
                                ></div>
                                {conv.unread > 0 && (
                                    <div className="absolute -top-1 -right-1 size-4 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-background-dark">
                                        {conv.unread}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline">
                                    <h3 className="text-white font-medium text-sm truncate">{conv.name}</h3>
                                    <span className="text-white/40 text-xs">{conv.time}</span>
                                </div>
                                <p className="text-white/60 text-xs truncate">{conv.lastMessage}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden flex flex-col">
                {activeConversation ? (
                    <>
                        <div className="p-4 border-b border-white/10 flex items-center gap-3">
                            <div
                                className="size-10 rounded-full bg-cover bg-center"
                                style={{ backgroundImage: `url('${activeConversation.avatar}')` }}
                            ></div>
                            <div>
                                <h3 className="text-white font-bold">{activeConversation.name}</h3>
                                <p className="text-green-400 text-xs flex items-center gap-1">
                                    <span className="size-2 rounded-full bg-green-400 block"></span>
                                    Online
                                </p>
                            </div>
                        </div>

                        <div className="flex-1 p-4 overflow-y-auto space-y-4">
                            <div className="flex justify-start">
                                <div className="bg-white/10 text-white rounded-2xl rounded-tl-none px-4 py-2 max-w-[70%]">
                                    <p>Hi! Looking forward to our session.</p>
                                    <span className="text-white/40 text-xs mt-1 block">10:28 AM</span>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <div className="bg-primary text-background-dark rounded-2xl rounded-tr-none px-4 py-2 max-w-[70%]">
                                    <p>Me too! I have prepared some questions.</p>
                                    <span className="text-background-dark/60 text-xs mt-1 block text-right">10:29 AM</span>
                                </div>
                            </div>
                            <div className="flex justify-start">
                                <div className="bg-white/10 text-white rounded-2xl rounded-tl-none px-4 py-2 max-w-[70%]">
                                    <p>Great! See you tomorrow!</p>
                                    <span className="text-white/40 text-xs mt-1 block">10:30 AM</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-white/10">
                            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <button type="submit" className="p-2 rounded-lg bg-primary text-background-dark hover:bg-primary/90 transition-colors">
                                    <span className="material-symbols-outlined">send</span>
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                        <span className="material-symbols-outlined text-white/20 text-8xl mb-4">chat</span>
                        <h3 className="text-white text-xl font-bold mb-2">Select a Conversation</h3>
                        <p className="text-white/60">Choose a contact from the left to start messaging.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
