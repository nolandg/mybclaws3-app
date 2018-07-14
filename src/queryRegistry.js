import qatch from 'await-to-js';

const queries = [];

export const register = (query) => {
  queries.push(query);
};

export const runQueries = (client) => {
  queries.forEach(async ({ query, variables }) => {
    console.log('query: ', query);
    const [error, data] = await qatch(client.query({ query, variables }));
    if(error) {
      console.error(error);
    }else{
      console.log('Data ', data);
    }
  });
};
