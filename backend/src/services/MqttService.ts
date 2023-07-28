import * as mqtt from 'mqtt';
import config from '../config';
import { Logger } from './LogService';
import { Service, ServiceEvent } from './Service';

export type MqttServiceEvent = 'published' | 'subscribed' | 'unsubscribed' | 'reconnect' | 'disconnected' | 'clientIdChanged' | ServiceEvent;

export class MqttService extends Service<MqttServiceEvent> {

    public get name(): string {
        return 'MQTT';
    }

    private logger = new Logger(this.name);
    private mqttClient: mqtt.Client | null = null;

    private static _instance: MqttService;
    private _clientId: string = '';

    public get clientId(): string {
        return this._clientId;
    }

    public set clientId(value: string) {
        if (this._clientId !== value && value !== '')
            this._clientId = value;
        this.emit('clientIdChanged', value);
    }

    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    private constructor() {
        super();
    }

    public get isConnected(): boolean {
        return this.mqttClient!.connected;
    }

    public start(): Promise<void> {
        if (this.running)
            return Promise.resolve();
        return new Promise<void>((resolve, reject) => {
            if (config.data.mqtt.enabled !== true) {
                this.logger.info('MQTT is disabled in config!');
                this.running = false;
                reject();
                return;
            }

            if (this.clientId == '') {
                this.logger.warn('Client ID is not set!');
                this.clientId = "Homium_" + Math.random().toString(16).slice(2, 10);
                this.logger.warn('Generated new client ID: ' + this.clientId);
            }

            this.mqttClient = mqtt.connect(`mqtt://${config.data.mqtt.host}:${config.data.mqtt.port}`, {
                username: config.data.mqtt.user,
                password: config.data.mqtt.password,
                clientId: this.clientId,
                clean: true,
                reconnectPeriod: 1000,
            });

            this.mqttClient.reconnecting = true;

            this.logger.info('Connecting to MQTT broker...');

            this.mqttClient.on('error', (e) => {
                this.logger.error('Error connecting to MQTT broker!');
                this.logger.error(e.message);
                this.emit('error', e);
            });

            this.mqttClient.on('connect', (e) => {
                this.logger.info('Connected to MQTT broker!');
            });

            this.mqttClient.on('reconnect', () => {
                this.logger.info('Reconnecting to MQTT broker...');
                this.emit('reconnect');
            });

            this.mqttClient.on('close', () => {
                this.logger.info('Disconnected from MQTT broker!');
                this.emit('disconnected');
            });

            this.running = true;
            this.emit('started');
            this.logger.info('MQTT service started');
            resolve();
        });
    }

    public stop(): Promise<void> {
        if (!this.running)
            return Promise.resolve();
        return new Promise<void>((resolve, reject) => {
            this.running = false;

            this.mqttClient?.end(true);
            this.mqttClient = null;

            this.emit('stopped');
            this.logger.info('MQTT service stopped');
            resolve();
        });
    }

    public publish(topic: string, message: string | number | boolean) {
        if (this.running == false) {
            return;
        }

        if (topic[0] !== '/') {
            topic = '/' + topic;
        }
        topic = config.data.mqtt.topic + topic;
        this.mqttClient?.publish(topic, message.toString(), { qos: 1 }, (err) => {
            if (err) {
                this.logger.error('Error publishing to MQTT broker! (topic: ' + topic + ')');
                this.logger.error(err.message);
                this.emit('error', err);
            } else {
                this.emit('published', topic, message.toString());
            }
        });
    }

    public subscribe(topic: string, callback: (topic: string, message: string) => void) {
        if (this.running == false) {
            return;
        }

        if (topic[0] !== '/') {
            topic = '/' + topic;
        }
        topic = config.data.mqtt.topic + topic;
        this.mqttClient?.subscribe(topic);
        this.mqttClient?.on('message', (topic, message) => {
            callback(topic, message.toString());
            this.emit('subscribed', topic);
        });
    }

    public unsubscribe(topic: string) {
        if (this.running == false) {
            return;
        }

        if (topic[0] !== '/') {
            topic = '/' + topic;
        }
        topic = config.data.mqtt.topic + topic;
        this.mqttClient?.unsubscribe(topic, undefined, (err) => {
            if (err) {
                this.logger.error('Error unsubscribing from MQTT broker! (topic: ' + topic + ')');
                this.logger.error(err.message);
                this.emit('error', err);
            } else {
                this.emit('unsubscribed', topic);
            }
        });
    }
}

export default MqttService.instance;