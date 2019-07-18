import { User } from './user';

export class Notification {
    notificationID: number;
    context: any;
    generator: User;
    target: User;
    type: string;
    opened: boolean;
    date: Date;
}
