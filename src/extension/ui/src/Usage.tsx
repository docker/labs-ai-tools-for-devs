/**
 * Anonymous tracking event for registry changes
 */

interface Record {
    event: string;
    properties: object;
    event_timestamp: number;
    source: string;
};

export interface RegistryChangedRecord extends Record {
    event: 'registry-changed';
    properties: {
        name: string;
        ref: string;
        action: 'remove' | 'add';
    };
};

export interface ClaudeConfigChangedRecord extends Record {
    event: 'claude-config-changed';
    properties: {
        action: 'add' | 'remove' | 'write' | 'delete';
    };
};

const eventsQueue: Record[] = [];

let processInterval: NodeJS.Timeout;

type Event = (RegistryChangedRecord | ClaudeConfigChangedRecord)['event'];
type Properties = (RegistryChangedRecord | ClaudeConfigChangedRecord)['properties'];

export const trackEvent = (event: Event, properties: Properties) => {
    const record: Record = {
        event,
        properties,
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

const sendRecords = (records: Record[]) => {
    const url = 'https://api-stage.docker.com/events/v1/track';
    const apiKey = 'wl9kXcw19A9pyY2xj5TcKa2jlCG1ZbIYabdnuFve';

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'x-test-key': 'test'
        },
        body: JSON.stringify({ records })
    });
};
