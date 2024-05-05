import os
from wsgiref import simple_server

import falcon
import requests

class TellerClient:

    _BASE_URL = 'https://api.teller.io'

    def __init__(self, cert, access_token=None):
        self.cert = cert
        self.access_token = access_token

    def for_user(self, access_token):
        return TellerClient(self.cert, access_token)

    def list_accounts(self):
        return self._get('/accounts')

    def get_account_details(self, account_id):
        return self._get(f'/accounts/{account_id}/details')

    def get_account_balances(self, account_id):
        return self._get(f'/accounts/{account_id}/balances')

    def list_account_transactions(self, account_id):
        return self._get(f'/accounts/{account_id}/transactions')

    def list_account_payees(self, account_id, scheme):
        return self._get(f'/accounts/{account_id}/payments/{scheme}/payees')

    def create_account_payee(self, account_id, scheme, data):
        return self._post(f'/accounts/{account_id}/payments/{scheme}/payees', data)

    def create_account_payment(self, account_id, scheme, data):
        return self._post(f'/accounts/{account_id}/payments/{scheme}', data)

    def _get(self, path):
        return self._request('GET', path)

    def _post(self, path, data):
        return self._request('POST', path, data)

    def _request(self, method, path, data=None):
        url = self._BASE_URL + path
        auth = (self.access_token, '')
        return requests.request(method, url, json=data, cert=self.cert, auth=auth)


class AccountsResource:

    def __init__(self, client):
        self._client = client

    def on_get(self, req, resp):
        self._proxy(req, resp, lambda client: client.list_accounts())

    def on_get_details(self, req, resp, account_id):
        self._proxy(req, resp, lambda client: client.get_account_details(account_id))

    def on_get_balances(self, req, resp, account_id):
        self._proxy(req, resp, lambda client: client.get_account_balances(account_id))

    def on_get_transactions(self, req, resp, account_id):
        self._proxy(req, resp, lambda client: client.list_account_transactions(account_id))

    def on_get_payees(self, req, resp, account_id, scheme):
        self._proxy(req, resp, lambda client: client.list_account_payees(account_id, scheme))

    def on_post_payees(self, req, resp, account_id, scheme):
        self._proxy(req, resp, lambda client: client.create_account_payee(account_id, scheme, req.media))

    def on_post_payments(self, req, resp, account_id, scheme):
        self._proxy(req, resp, lambda client: client.create_account_payment(account_id, scheme, req.media))

    def _proxy(self, req, resp, fun):
        access_token = req.get_header('Authorization').split(' ')[1]  # Assuming Bearer token
        user_client = self._client.for_user(access_token)
        teller_response = fun(user_client)

        if teller_response.content:
            resp.media = teller_response.json()

        resp.status = falcon.HTTP_200 if teller_response.ok else falcon.HTTP_400


def main():
    cert = ('./static/certificate.pem', './static/private_key.pem')
    client = TellerClient(cert)

    print("Starting up ...")

    accounts = AccountsResource(client)

    app = falcon.App(
        middleware=falcon.CORSMiddleware(allow_origins='*', allow_credentials='*')
    )

    app.add_route('/api/accounts', accounts)
    app.add_route('/api/accounts/{account_id}/details', accounts,
            suffix='details')
    app.add_route('/api/accounts/{account_id}/balances', accounts,
            suffix='balances')
    app.add_route('/api/accounts/{account_id}/transactions', accounts,
            suffix='transactions')
    app.add_route('/api/accounts/{account_id}/payments/{scheme}/payees', accounts,
            suffix='payees')
    app.add_route('/api/accounts/{account_id}/payments/{scheme}', accounts,
            suffix='payments')

    port = os.getenv('PORT') or '8001'

    httpd = simple_server.make_server('', int(port), app)

    print(f"Listening on port {port}, press ^C to stop.\n")

    httpd.serve_forever()

if __name__ == '__main__':
    main()