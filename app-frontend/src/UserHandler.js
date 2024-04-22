class UserHandler {
    constructor(labels) {
      this.labels = labels;
    }
  
    onEnrollment(enrollment) {
      this.labels.userId.textContent = enrollment.user.id;
      this.labels.accessToken.textContent = enrollment.accessToken;
    }
  
    clear() {
      const nodes = Object.values(this.labels);
      nodes.forEach(function(node) {
        node.textContent = 'not_available';
      });
    }
  }