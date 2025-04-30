// frontend/src/components/dashboard/RoomFilter.jsx
import React, { useState, useEffect } from 'react'; // Add useState and useEffect imports
import roomService from '../../services/roomService';

const RoomFilter = ({ selectedRoom, onRoomChange }) => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Make sure we always have the "All Rooms" option
    const allRoomsOption = { id: 'all', name: 'All Rooms' };

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                setLoading(true);

                // Try to fetch rooms from API
                try {
                    // const roomsData = await roomService.getRooms();
                    // setRooms(roomsData);
                    // setLoading(false);
                    console.log('Attempting to fetch rooms from API...');
                    const response = await roomService.getRooms();
                    console.log('Rooms API response:', response);

                    if (response && Array.isArray(response)) {
                        setRooms(response);
                    } else if (response && Array.isArray(response.data)) {
                        setRooms(response.data);
                    } else {
                        // Fallback if response format is unexpected
                        throw new Error('Unexpected API response format');
                    }
                } catch (err) {
                    console.log('API fetch failed, using fallback room data');
                    // Fall back to the hardcoded rooms if API fails
                    setRooms([
                        { id: 'living', name: 'Living Room' },
                        { id: 'bedroom', name: 'Bedroom' },
                        { id: 'kitchen', name: 'Kitchen' },
                        { id: 'bathroom', name: 'Bathroom' },
                        { id: 'office', name: 'Office' }
                    ]);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching rooms:', error);
                setError('Failed to load rooms');
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

    return (
        <div className="room-filter">
            <div className="room-filter-scroll">
                {/* Always show "All Rooms" option first */}
                <button
                    key={allRoomsOption.id}
                    className={`room-filter-btn ${selectedRoom === allRoomsOption.name ? 'active' : ''}`}
                    onClick={() => onRoomChange(allRoomsOption.name)}
                >
                    {allRoomsOption.name}
                </button>

                {/* Then show the rooms from the API/fallback */}
                {rooms.map(room => (
                    <button
                        key={room.id || room.name}  // Use a unique identifier
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
