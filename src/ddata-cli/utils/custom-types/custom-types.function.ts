import { Field } from '../../field';

export function customTypesList(fields: Field[]): string {
  const custom_types: string[] = [];

  fields.forEach((field) => {
    if (field.type === 'ColorHexaCode' || field.type === 'ISODate' || field.type === 'Time') {
      custom_types.push(field.type);
    }
  });

  return custom_types.length > 0 ? ', ' + custom_types.join(', ') : '';
}
