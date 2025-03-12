// frontend/src/components/dashboard/QuickRoutines.jsx
import React, { useState } from 'react';

const QuickRoutines = () => {
    const [activeRoutine, setActiveRoutine] = useState(null);

    // Define quick routines with icons and descriptions
    const routines = [
        {
            id: 'morning',
            name: 'Good Morning',
            icon: 'fa-sun',
            description: 'Opens blinds, turns on lights at 30%, starts coffee maker'
        },
        {
            id: 'working',
            name: 'Working',
            icon: 'fa-briefcase',
            description: 'Adjusts lights to cool white, sets thermostat to 22°C'
        },
        {
            id: 'sleeping',
            name: 'Sleeping',
            icon: 'fa-moon',
            description: 'Dims lights, locks doors, lowers thermostat to 19°C'
        },
        {
            id: 'away',
            name: 'Away Mode',
            icon: 'fa-car',
            description: 'Turns off all lights, locks doors, activates security system'
        }
    ];

    const handleRoutineClick = (routineId) => {
        // In a real app, this would trigger the actual routine via your backend
        // For now, we'll just toggle the active state for UI feedback

        if (activeRoutine === routineId) {
            setActiveRoutine(null);
        } else {
            setActiveRoutine(routineId);

            // Simulate the routine running
            setTimeout(() => {
                setActiveRoutine(null);
            }, 2000);
        }
    };

    return (
        <div className="quick-routines">
            {routines.map(routine => (
                <button
                    key={routine.id}
                    className={`routine-button ${activeRoutine === routine.id ? 'active' : ''}`}
                    onClick={() => handleRoutineClick(routine.id)}
                    title={routine.description}
                >
                    <div className="routine-icon">
                        <i className={`fas ${routine.icon}`}></i>
                    </div>
                    <span className="routine-name">{routine.name}</span>
                    {activeRoutine === routine.id && (
                        <div className="routine-loader"></div>
                    )}
                </button>
            ))}

            <button className="routine-button add-routine">
                <div className="routine-icon">
                    <i className="fas fa-plus"></i>
                </div>
                <span className="routine-name">Add</span>
            </button>
        </div>
    );
};

export default QuickRoutines;
