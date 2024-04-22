class TellerStore {
    constructor() {
      this.keys = {
        enrollment: 'teller:enrollment',
        user: 'teller:user',
      }
    }
  
    getUser() {
      return this.get(this.keys.user);
    }
  
    getEnrollment() {
      return this.get(this.keys.enrollment);
    }
  
    putUser(user) {
      return this.put(this.keys.user, user);
    }
  
    putEnrollment(enrollment) {
      return this.put(this.keys.enrollment, enrollment);
    }
  
    clear() {
      localStorage.clear();
    }
  
    get(key) {
      const raw = localStorage.getItem(key);
      return JSON.parse(raw);
    }
  
    put(key, value) {
      const raw = JSON.stringify(value);
      return localStorage.setItem(key, raw);
    }
  }