export interface TelegramBotConfig {
    token: string;
    webhook: {
        enabled: boolean;
        certificate: string;
        host: string;
    };
}