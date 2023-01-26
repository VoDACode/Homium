import * as mqtt from 'mqtt';
import config from '../config';
import { Logger } from './LogService';

//@ts-ignore
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

export class MqttService {
    private logger = new Logger('MQTT');
    private mqttClient: mqtt.Client;

    private static _instance: MqttService;

    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    private constructor() {
        this.mqttClient = mqtt.connect(`mqtt://${config.mqtt.host}:${config.mqtt.port}`, {
            username: config.mqtt.user,
            password: config.mqtt.password,
            clientId: "Homium",
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
        return this.mqttClient.connected;
    }

    public publish(topic: string, message: string | number | boolean) {
        this.mqttClient.publish(topic, message.toString(), { qos: 1 }, (err) => {
            if (err) {
                console.error(err);
            }
        });
    }

    public subscribe(topic: string, callback: (topic: string, message: string) => void) {
        this.mqttClient.subscribe(topic);
        this.mqttClient.on('message', (topic, message) => {
            callback(topic, message.toString());
        });
    }

    public unsubscribe(topic: string) {
        this.mqttClient.unsubscribe(topic);
    }
}

export default MqttService.instance;