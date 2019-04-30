export class Client {
  id?: number;
  casId: number;
  lastname: string;
  firstname: string;
  email: string;
  acceptNewsletter: boolean;
}

export class ClientAndPermissions {
  0: Client;
  1: string[];

  getClient() {
    return this[0];
  }

  getPermissions() {
    return this[1];
  }
}
