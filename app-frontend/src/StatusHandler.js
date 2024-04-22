class StatusHandler {
    constructor(button) {
      this.connected = false;
      this.button = button;
    }
  
    onEnrollment(enrollment) {
      this.setConnected(true);
      this.button.textContent = 'Disconnect';
    }
  
    toggle(callbacks) {
      if (this.connected) {
        this.setConnected(false);
        this.button.textContent = 'Connect';
  
        callbacks.onDisconnect();
      } else {
        callbacks.onConnect();
      }
    }
  
    setConnected(connected) {
      this.connected = connected;
    }
  }