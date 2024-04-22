class PayeeModalTemplate {
    constructor(template) {
      this.template = template;
    }
  
    render(prefilledName, prefilledEmail) {
      const node = this.template.content.cloneNode(true);
  
      const name = node.querySelector('#payee-name');
      const email = node.querySelector('#payee-email');
  
      name.value = prefilledName;
      email.value = prefilledEmail;
  
      return node;
    }
  }