export const socketEvents = {
    // Device events
    DEVICE_UPDATED: 'device:updated',
    DEVICE_STATE_CHANGED: 'device:state-changed',
    DEVICE_ADDED: 'device:added',
    DEVICE_REMOVED: 'device:removed',

    // Room events
    ROOM_UPDATED: 'room:updated',
    ROOM_ADDED: 'room:added',
    ROOM_REMOVED: 'room:removed',

    // Group events
    GROUP_UPDATED: 'group:updated',
    GROUP_ADDED: 'group:added',
    GROUP_REMOVED: 'group:removed',

    // Schedule events
    SCHEDULE_UPDATED: 'schedule:updated',
    SCHEDULE_ADDED: 'schedule:added',
    SCHEDULE_REMOVED: 'schedule:removed',
    SCHEDULE_TRIGGERED: 'schedule:triggered',

    // Notification events
    NOTIFICATION_NEW: 'notification:new',

    // Connection events
    JOIN_ROOM: 'join-room',
};
