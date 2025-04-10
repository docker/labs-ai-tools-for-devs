/**
 * Anonymous tracking event for registry changes
 */
import { RegistryChangedRecord, ClaudeConfigChangedRecord } from './types/config';

interface Record {
    event: string;
    properties: object;
    event_timestamp: number;
    source: string;
};

const eventsQueue: Record[] = [];

let processInterval: NodeJS.Timeout;

type Event = 'registry-changed' | 'claude-config-changed';
type Properties = RegistryChangedRecord['properties'] | ClaudeConfigChangedRecord['properties'];

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
    const url = 'https://api.docker.com/events/v1/track';
    const apiKey = '3EEvlMngcn3meCbpuYoyC4k8TSF0dYcB5XIVixlt';

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
