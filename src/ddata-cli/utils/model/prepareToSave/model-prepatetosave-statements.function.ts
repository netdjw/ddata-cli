import { underscore } from "@angular-devkit/core/src/utils/strings";
import { Field } from "../../../field";

export function modelPrepareToSaveStatements(fields: Field[]) {
  const lines: string[] = [];

  fields.filter(field => field.is_array === true).forEach((field: Field) => {
    lines.push(
      `    // ${ underscore(field.name) }`,
      `    const ${ underscore(field.name) }: any[] = [];`,
      `    this.${ underscore(field.name) }.forEach((element: ${ field.model_name }Interface) => {`,
      `      ${ underscore(field.name) }.push(element.prepareToSave());`,
      `    });`,
      ``,
    );
  });

  lines.push(`    return {`);

  fields.forEach((field) => {
    if (field.model_name === '') {
      lines.push(`      ${ underscore(field.name) }: !!this.${ underscore(field.name) } ? this.${ underscore(field.name) } : ${ field.default },`);
    } else {
      if (!field.is_array) {
        lines.push(`      ${ underscore(field.name) }_id: !!this.${ underscore(field.name) }_id ? this.${ underscore(field.name) }_id : ${ field.default !== 'null' ? field.default : '0' },`);
      }
    }
  });

  fields.filter(field => field.is_array === true).forEach((field: Field) => {
    lines.push(`      ${ underscore(field.name) },`);
  });

  lines.push(`    };`);

  return lines.join('\n');
}
