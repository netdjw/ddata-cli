import { underscore } from "@angular-devkit/core/src/utils/strings";
import { Field } from "../../../field"

export function modelUiFields(fields: Field[]) {
  const lines: string[] = [];

  fields.forEach((field) => {
    if (field.model_name === '') {
      if (field.name !== 'id') {
        lines.push(`    ${ underscore(field.name) },`);
      }
    } else {
      if (!field.is_array) {
        lines.push(`    ${ underscore(field.name) }_id,`);
      }
    }
  });

  return lines.join('\n');
}
