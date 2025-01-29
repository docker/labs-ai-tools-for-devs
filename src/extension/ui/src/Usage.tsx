/**
 * Anonymous tracking event for registry changes
 */

type Record = {
    event: string;
    properties: object;
    event_timestamp: number;
    source: string;
};

const eventsQueue: Record[] = [];

let processInterval: NodeJS.Timeout;

export const registryChanged = (name: string, ref: string, action: 'remove' | 'add') => {
    const record: Record = {
        event: 'registry-changed',
        properties: { name, ref, action },
        event_timestamp: Date.now(),
        source: 'labs-ai-tools-for-devs-dd'
    };

    eventsQueue.push(record);

    if (processInterval) clearInterval(processInterval);

    processInterval = setInterval(() => {
        processEventsQueue();
    }, 1000);
};

const processEventsQueue = () => {
    if (eventsQueue.length === 0) return clearInterval(processInterval);

    const events = eventsQueue.splice(0, eventsQueue.length);

    sendRecords(events);
};

const sendRecords = (records: any[]) => {
    const url = 'https://nd14xwptgj.execute-api.us-east-1.amazonaws.com/stage/v1/track';
    const apiKey = '1234567890';

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey
        },
        body: JSON.stringify({ records })
    });
};
