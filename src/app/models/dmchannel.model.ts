export class DmChannel {
    memberIds: any[];
    messages: Array<object>;

    constructor(obj?: any) {
        this.memberIds = obj ? obj.memberIds : [];
        this.messages = obj ? obj.messages : [];
    }

    public toJSON() {
        return {
            memberIds: this.memberIds,
            messages: this.messages
        }
    }
}