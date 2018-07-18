const queries = [];

export const register = (query) => {
  queries.push(query);
};

export const runQueries = () => {
  queries.forEach(async (q) => {
    q();
  });
};
