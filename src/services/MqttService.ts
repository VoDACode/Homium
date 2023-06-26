import * as mqtt from 'mqtt';
import config from '../config';
import { Logger } from './LogService';

export class MqttService {
    private logger = new Logger('MQTT');
    private mqttClient: mqtt.Client | null = null;

    private static _instance: MqttService;

    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    private constructor() {
        if(config.mqtt.enabled !== true) {
            this.logger.info('MQTT is disabled in config!');
            return;
        }
        this.mqttClient = mqtt.connect(`mqtt://${config.mqtt.host}:${config.mqtt.port}`, {
            username: config.mqtt.user,
            password: config.mqtt.password,
            clientId: "Homium_" + Math.random().toString(16).slice(2, 10),
            clean: true
        });
        this.logger.info('Connecting to MQTT broker...');
        this.mqttClient.on('error', (e) => {
            this.logger.error('Error connecting to MQTT broker!');
            this.logger.error(e.message);
        });
        this.mqttClient.on('connect', (e) => {
            this.logger.info('Connected to MQTT broker!');
        });
    }

    public get isConnected(): boolean {
        return this.mqttClient!.connected;
    }

    public publish(topic: string, message: string | number | boolean) {
        if(topic[0] !== '/') {
            topic = '/' + topic;
        }
        topic = config.mqtt.topic + topic;
        this.mqttClient?.publish(topic, message.toString(), { qos: 1 }, (err) => {
            if (err) {
                console.error(err);
            }
        });
    }

    public subscribe(topic: string, callback: (topic: string, message: string) => void) {
        if(topic[0] !== '/') {
            topic = '/' + topic;
        }
        topic = config.mqtt.topic + topic;
        this.mqttClient?.subscribe(topic);
        this.mqttClient?.on('message', (topic, message) => {
            callback(topic, message.toString());
        });
    }

    public unsubscribe(topic: string) {
        if(topic[0] !== '/') {
            topic = '/' + topic;
        }
        topic = config.mqtt.topic + topic;
        this.mqttClient?.unsubscribe(topic);
    }
}

export default MqttService.instance;