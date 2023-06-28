export class Channel {
    channelName: string;
    createdFromUserId: any;
    messages: Array<object>;

    constructor(obj?: any) { 
        this.channelName = obj ? obj.channelName : '';
        this.createdFromUserId = obj ? obj.createdFromUserId : '';
        this.messages = obj ? obj.messages : [];
    }

    public toJSON() {
        return {
            channelName: this.channelName,
            createdFromUserId: this.createdFromUserId,
            messages: this.messages
        };
    }
}