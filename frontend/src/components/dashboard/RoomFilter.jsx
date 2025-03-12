// frontend/src/components/dashboard/RoomFilter.jsx
import React from 'react';

const RoomFilter = ({ selectedRoom, onRoomChange }) => {
    // Sample room data - in a real app, this would come from your backend
    const rooms = [
        { id: 'all', name: 'All Rooms' },
        { id: 'living', name: 'Living Room' },
        { id: 'bedroom', name: 'Bedroom' },
        { id: 'kitchen', name: 'Kitchen' },
        { id: 'bathroom', name: 'Bathroom' },
        { id: 'office', name: 'Office' }
    ];

    return (
        <div className="room-filter">
            <div className="room-filter-scroll">
                {rooms.map(room => (
                    <button
                        key={room.id}
                        className={`room-filter-btn ${selectedRoom === room.name ? 'active' : ''}`}
                        onClick={() => onRoomChange(room.name)}
                    >
                        {room.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default RoomFilter;
