// frontend/src/components/dashboard/RoomFilter.jsx
import React, { useState, useEffect } from 'react'; // Add useState and useEffect imports
import roomService from '../../services/roomService';
import RoomManageModal from './RoomManageModal';

const RoomFilter = ({ selectedRoom, onRoomChange }) => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRoomToEdit, setSelectedRoomToEdit] = useState(null);

    // Make sure we always have the "All Rooms" option
    const allRoomsOption = { id: 'all', name: 'All Rooms' };

    const fetchRooms = async () => {
        try {
            setLoading(true);
            setError(null);

            // Try to fetch rooms from API
            try {
                const response = await roomService.getRooms();

                // Check if the response has the expected structure
                if (response && response.data) {
                    setRooms(response.data);
                } else {
                    console.warn('Unexpected API response format:', response);
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
                ]);
            } finally {
                setLoading(false);
            }
        } catch (error) {
            console.error('Error fetching rooms:', error);
            setError('Failed to load rooms');
            setLoading(false);
        }
    };

    useEffect(() => {

        fetchRooms();
    }, []);

    // Add this function to handle room changes from the modal
    const handleRoomUpdated = (room, isDeleted = false) => {
        if (isDeleted) {
            // Remove the deleted room from the list
            setRooms(prevRooms => prevRooms.filter(r => r._id !== selectedRoomToEdit._id));

            // If the currently selected room was deleted, switch to "All Rooms"
            if (selectedRoom === selectedRoomToEdit.name) {
                onRoomChange(allRoomsOption.name);
            }
        } else if (room) {
            if (selectedRoomToEdit) {
                // Update existing room
                setRooms(prevRooms =>
                    prevRooms.map(r => r._id === room._id ? room : r)
                );

                // If this was the selected room, update the selected room name
                if (selectedRoom === selectedRoomToEdit.name) {
                    onRoomChange(room.name);
                }
            } else {
                // Add new room
                setRooms(prevRooms => [...prevRooms, room]);
            }
        }

        // Refresh rooms from the API
        fetchRooms();
    };

    // Update the return section in RoomFilter.jsx
    return (
        <div className="room-filter-container">
            <div className="room-filter">
                {loading ? (
                    <div className="room-filter-loading">
                        <span>Loading rooms...</span>
                    </div>
                ) : error ? (
                    <div className="room-filter-error">
                        <span>{error}</span>
                    </div>
                ) : (
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
                                {rooms.map((room, index) => (
                                    <div key={`${room._id || room.id || room.name}-${index}`} className="room-filter-btn-wrapper">
                                        <button
                                            className={`room-filter-btn ${selectedRoom === room.name ? 'active' : ''}`}
                                            onClick={() => onRoomChange(room.name)}
                                        >
                                            <i className={`fas ${room.icon || 'fa-home'} mr-1`}></i>
                                            {room.name}
                                        </button>

                                        <button
                                            className="room-edit-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedRoomToEdit(room);
                                                setIsModalOpen(true);
                                            }}
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                    </div>
                                ))}



                        {/* Add room button */}
                        <button
                            className="room-filter-btn add-room-btn"
                            onClick={() => {
                                setSelectedRoomToEdit(null);
                                setIsModalOpen(true);
                            }}
                        >
                            <i className="fas fa-plus"></i> Add Room
                        </button>
                    </div>
                )}
            </div>

            {/* Room management modal */}
            <RoomManageModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                roomToEdit={selectedRoomToEdit}
                onRoomChange={handleRoomUpdated}
            />
        </div>
    );
};

export default RoomFilter;
