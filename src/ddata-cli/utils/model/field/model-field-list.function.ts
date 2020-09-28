import { underscore } from "@angular-devkit/core/src/utils/strings";
import { Field } from "../../../field";

export function modelFieldList(fields: Field[]) {
  const lines: string[] = [];

  fields.forEach((field) => {
    if (field.name === 'id') {
      lines.push(`  id: ID;`);

      return;
    }

    if (field.model_name === '') {
      lines.push(`  ${ underscore(field.name) }: ${ field.type === 'text' ? 'string' : field.type };`);
    } else {
      if (!field.is_array) {
        lines.push(
          `  ${ underscore(field.name) }_id: number;`,
          `  ${ underscore(field.name) }: ${ field.type };`,
        );
      } else {
        lines.push(`  ${ underscore(field.name) }: ${ field.type }[] = [];`);
      }
    }
  });

  return lines.join('\n');
}
