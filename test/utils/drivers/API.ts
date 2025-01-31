import { browser } from "@wdio/globals";

import type { AppDriver } from "../types";

export class APIAppDriver implements AppDriver {
  private driver = browser;
  private baseUrl = `${process.env.BACKEND_HOST}:${process.env.BACKEND_PORT}`;
  private mongodbUrl = `${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}`;

  private query = "";
  private queryResult = "";

  constructor() {}

  public async setQuery(query: string) {
    this.query = JSON.parse(query);
  }

  public async clickRunQuery() {
    const response = await fetch(`${this.baseUrl}/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: this.query }),
    });

    this.queryResult = JSON.stringify(await response.json());
  }

  public async getQueryResult() {
    return Promise.resolve(this.queryResult);
  }
}
