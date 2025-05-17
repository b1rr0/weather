export class MailWeatherNotification {
  email: string;
  city: string;
}

export class MailRegistrationNotification {
  email: string;
  token: string;
}

export enum AsyncMessageType {
  MAIL_REGISTRATION_NOTIFICATION = 'MAIL_REGISTRATION_NOTIFICATION',
  MAIL_WEATHER_NOTIFICATION = 'MAIL_WEATHER_NOTIFICATION',
}

export class AsyncMessage {
  type: AsyncMessageType;
  data: MailRegistrationNotification | MailWeatherNotification;
  key: string;
}

export enum Topic {
  SUBSCRIPTION = 'subscription',
  WEATHER = 'weather',
}
