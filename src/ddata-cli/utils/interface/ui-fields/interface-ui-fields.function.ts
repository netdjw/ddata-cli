import { underscore } from '@angular-devkit/core/src/utils/strings';
import { Field } from '../../../field';

export function interfaceUiFieldsList(fields: Field[]) {
  const field_definitions: string[] = [];

  fields.forEach((field: Field) => {
    if (field.model_name === '') {
      if (field.name !== 'id') {
        field_definitions.push(`  ${underscore(field.name)}: ${field.type === 'text' ? 'string' : field.type};`);
      }
    } else {
      if (!field.is_array) {
        field_definitions.push(`  ${underscore(field.name)}_id: number;`);
      }
    }
  });

  return field_definitions.join('\n');
}
