import { underscore } from '@angular-devkit/core/src/utils/strings';
import { Field } from '../../../field';

export function interfaceOtherFieldsList(fields: Field[]) {
  const field_definitions: string[] = [];

  fields.forEach((field: Field) => {
    if (field.model_name === '') {
      if (field.name === 'id') {
        field_definitions.push(`  ${underscore(field.name)}: ${field.type};`);
      }
    } else {
      field_definitions.push(`  ${underscore(field.name)}: ${field.type}${ field.is_array ? '[]' : '' };`);
    }
  });

  return field_definitions.join('\n');
}
