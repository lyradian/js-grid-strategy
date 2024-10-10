class Message {
    constructor (message, owner) {
        this.message = message;
        this.owner = owner;
        this.timestamp = Date.now();
        this.isRead = false;
    }
}