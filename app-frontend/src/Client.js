class Client {
    constructor() {
      this.baseURL = BASE_URL;
      this.accessToken = null;
    }
  
    listAccounts() {
      return this.get('/accounts');
    }
  
    getAccountDetails(account) {
      return this.get(`/accounts/${account.id}/details`);
    }
  
    getAccountBalances(account) {
      return this.get(`/accounts/${account.id}/balances`);
    }
  
    listAccountTransactions(account) {
      return this.get(`/accounts/${account.id}/transactions`);
    }
  
    listAccountPayees(account) {
      return this.get(`/accounts/${account.id}/payments/zelle/payees`);
    }
  
    createAccountPayee(account, payee) {
      return this.post(`/accounts/${account.id}/payments/zelle/payees`, payee);
    }
  
    createAccountPayment(account, payment) {
      return this.post(`/accounts/${account.id}/payments/zelle`, payment);
    }
  
    get(path) {
      return this.request('GET', path, null);
    }
  
    post(path, data) {
      return this.request('POST', path, JSON.stringify(data));
    }
  
    request(method, path, data) {
      const request = new Request(this.baseURL + path, {
        method: method,
        headers: new Headers({
          'Authorization': this.accessToken,
          'Content-Type': 'application/json',
        }),
        body: data,
      });
  
      return fetch(request);
    }
  }