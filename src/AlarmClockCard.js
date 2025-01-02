import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Clock, Timer } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'triggered':
        return 'bg-red-500';
      case 'snoozed':
        return 'bg-orange-500';
      case 'set':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <span className={`${getStatusColor()} text-white px-3 py-1 rounded-full text-sm font-medium`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const TimeDisplay = ({ time, entity }) => {
  if (!time) return null;
  
  const formattedTime = new Date(time).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  return (
    <div className="flex items-center gap-2 text-4xl font-bold text-gray-800">
      <Clock className="w-8 h-8" />
      <span>{formattedTime}</span>
    </div>
  );
};

const AlarmClockCard = ({ hass, config }) => {
  const [entity, setEntity] = useState(null);
  const [timeEntity, setTimeEntity] = useState(null);
  const [countdownEntity, setCountdownEntity] = useState(null);
  const [statusEntity, setStatusEntity] = useState(null);

  useEffect(() => {
    if (!config.entity) return;

    const baseEntityId = config.entity;
    const timeEntityId = baseEntityId.replace('switch.', 'datetime.');
    const countdownEntityId = baseEntityId.replace('switch.', 'sensor.') + '_countdown';
    const statusEntityId = baseEntityId.replace('switch.', 'sensor.') + '_status';

    setEntity(hass.states[baseEntityId]);
    setTimeEntity(hass.states[timeEntityId]);
    setCountdownEntity(hass.states[countdownEntityId]);
    setStatusEntity(hass.states[statusEntityId]);
  }, [hass, config]);

  if (!entity || !timeEntity || !countdownEntity || !statusEntity) {
    return <div>Loading...</div>;
  }

  const isActive = entity.state === 'on';
  const alarmTime = timeEntity.state;
  const countdown = countdownEntity.attributes.formatted;
  const status = statusEntity.state;

  const handleToggle = () => {
    hass.callService('switch', isActive ? 'turn_off' : 'turn_on', {
      entity_id: entity.entity_id,
    });
  };

  const handleSnooze = () => {
    hass.callService('alarm_clock', 'snooze', {
      entity_id: entity.entity_id,
    });
  };

  const handleStop = () => {
    hass.callService('alarm_clock', 'stop', {
      entity_id: entity.entity_id,
    });
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{entity.attributes.friendly_name}</h2>
        <StatusBadge status={status} />
      </div>
      
      <div className="space-y-4">
        <TimeDisplay time={alarmTime} entity={timeEntity} />
        
        {isActive && countdown && (
          <div className="flex items-center gap-2 text-gray-600">
            <Timer className="w-5 h-5" />
            <span>Time until alarm: {countdown}</span>
          </div>
        )}
        
        <div className="flex gap-2">
          <button
            onClick={handleToggle}
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              isActive ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
            }`}
          >
            {isActive ? <BellOff className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
            {isActive ? 'Disable' : 'Enable'}
          </button>
          
          {status === 'triggered' && (
            <>
              <button
                onClick={handleSnooze}
                className="flex items-center gap-2 px-4 py-2 rounded bg-orange-500 text-white"
              >
                Snooze
              </button>
              <button
                onClick={handleStop}
                className="flex items-center gap-2 px-4 py-2 rounded bg-gray-500 text-white"
              >
                Stop
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlarmClockCard;