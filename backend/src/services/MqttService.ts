import { serviceManager, BaseService, IConfigService, ILogger } from 'homium-lib/services';
import { MqttServiceEvent } from 'homium-lib/types/mqtt.types';
import * as mqtt from 'mqtt';

export class MqttService extends BaseService<MqttServiceEvent> {

    public get name(): string {
        return 'MqttService';
    }

    private logger: ILogger;
    private configService: IConfigService;
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

    constructor() {
        super();
        this.logger = serviceManager.get(ILogger, this.name);
        this.configService = serviceManager.get(IConfigService);
    }

    public get isConnected(): boolean {
        return this.mqttClient!.connected;
    }

    public start(): Promise<void> {
        if (this.running)
            return Promise.resolve();
        return new Promise<void>((resolve, reject) => {
            if (this.configService.config.mqtt.enabled !== true) {
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

            this.mqttClient = mqtt.connect(`mqtt://${this.configService.config.mqtt.host}:${this.configService.config.mqtt.port}`, {
                username: this.configService.config.mqtt.user,
                password: this.configService.config.mqtt.password,
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
        topic = this.configService.config.mqtt.topic + topic;
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
        topic = this.configService.config.mqtt.topic + topic;
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
        topic = this.configService.config.mqtt.topic + topic;
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