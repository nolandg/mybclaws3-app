import { object, string, date } from 'yup';

export default {
  typeName: 'post',
  connectionName: 'default',
  schema: object().shape({
    _id: string(),
    title: string()
      .label('Title')
      .default('My Awesome Title')
      .required()
      .trim(),
    createdAt: date(),
    updatedAt: date(),
  }),
};
