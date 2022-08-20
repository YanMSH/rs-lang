import { serverURL } from "../constants/loader-constants";
import { Word, User } from "../type/loader-types";

export default class Loader {
  serverURL: string;
  userEP: string;
  wordsEP: string;
  token: string;

  constructor() {
    this.serverURL = serverURL;
    this.userEP = this.serverURL + 'users';
    this.wordsEP = this.serverURL + 'words';
    this.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlYzk5M2RmNGNhOWQ2MDAxNzg3NDBhZSIsImlhdCI6MTU5MDI2OTE1OCwiZXhwIjoxNTkwMjgzNTU4fQ.XHKmdY_jk1R7PUbgCZfqH8TxH6XQ0USwPBSKNHMdF6I';
  }

  async getWords(group: number, page: number, token: string = this.token): Promise<Word[] | string> {
    const newUrl = `${this.serverURL}words?group=${group}&page=${page}`;
    const response = await fetch(newUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    }
    });
    const content = await response.json();
    // console.log(content);
    return content;
  }
  
  async getUsersWord(userId: string, token: string = this.token): Promise<User | string> {
    const userUrl = `${this.serverURL}/${userId}/word`
    const response = await fetch(userUrl, {
    method: 'GET',
    // withCredentials: true,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    }
    });
    const content = await response.json();
    console.log(content);
    return content;
  }
}