class DetailTemplate {
    constructor(template) {
      this.template = template;
    }
  
    render(details) {
      const node = this.template.content.cloneNode(true);
  
      const number = node.querySelector('.detail .number');
      const ach = node.querySelector('.detail .ach');
  
      number.textContent = `${details.account_number}`;
      ach.textContent = `${details.routing_numbers.ach}`;
  
      return node;
    }
  }