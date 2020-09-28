import { underscore } from '@angular-devkit/core/src/utils/strings';
import { Field } from '../../../field';

export function interfaceOtherFieldsList(fields: Field[]) {
  const lines: string[] = [];

  fields.forEach((field: Field) => {
    if (field.model_name === '') {
      if (field.name === 'id') {
        lines.push(`  id: ID;`);
      }
    } else {
      lines.push(`  ${underscore(field.name)}: ${field.type}${ field.is_array ? '[]' : '' };`);
    }
  });

  return lines.join('\n');
}
