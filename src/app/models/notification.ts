import { User } from './user';

export class notification {
    notificationID: number;
    context: any;
    generator: User;
    target: User;
    type: string;
    opened: boolean;
    date: Date;
}