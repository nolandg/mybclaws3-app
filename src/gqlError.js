
const gqlError = (error) => {
  const obj = {};

  if(error.graphQLErrors && error.graphQLErrors.length) {
    const e = error.graphQLErrors[0];
    obj.message = e.message;
    if(e.path && e.path.length) {
      obj.message += ` in "${e.path[0]}"`;
    }
  }else{
    obj.message = 'Unknown';
  }

  return obj;
};

export default gqlError;
