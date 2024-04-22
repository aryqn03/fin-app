class LogTemplate {
    constructor(template) {
      this.template = template;
    }
  
    render(resource) {
      const node = this.template.content.cloneNode(true);
  
      const name = node.querySelector('.log .resource');
      const timestamp = node.querySelector('.log .timestamp');
      const http = node.querySelector('.log .http');
  
      name.textContent = resource.name;
      timestamp.textContent = new Date().toLocaleString();
      http.textContent = `${resource.method} ${resource.path}`;
  
      return node;
    }
  }