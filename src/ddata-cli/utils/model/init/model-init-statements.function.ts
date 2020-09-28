import { underscore } from "@angular-devkit/core/src/utils/strings";
import { Field } from "../../../field";

export function modelInitStatements(fields: Field[]) {
  const lines: string[] = [];

  // primitive and advanced types
  fields.forEach((field: Field) => {
    if (field.model_name === '') {
      lines.push(
        `    this.${ underscore(field.name) } = !!data.${ underscore(field.name) } ? ` +
          `data.${ underscore(field.name) } : ${ field.default };`);
    } else {
      if (!field.is_array) {
        lines.push(
          `    this.${ underscore(field.name) } = !!data.${ underscore(field.name) } ? ` +
            `new ${ field.model_name }().init(data.${ underscore(field.name) }) : ${ field.default };`,
          `    this.${ underscore(field.name) }_id = !!data.${ underscore(field.name) }_id ? ` +
            `data.${ underscore(field.name) }_id : 0;`,
        );
      }
    }
  });

  lines.push(``);

  fields.filter((field: Field) => field.is_array === true).forEach((field: Field) => {
    lines.push(
      `    // ${ underscore(field.name) }`,
      `    if (!!data.${ underscore(field.name) } && data.${ underscore(field.name) } instanceof Array) {`,
      `      data.${ underscore(field.name) }.forEach((element: any) => {`,
      `        this.${ underscore(field.name) }.push( new ${ field.model_name }().init(element) );`,
      `      });`,
      `    }`,
      ``,
    );
  });

  return lines.join('\n');
}
