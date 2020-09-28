import { underscore } from "@angular-devkit/core/src/utils/strings";
import { Field } from "../../field";

export function i18nConstList(fields: Field[]) {
  const lines: string[] = [];
  const langs: string[] = [];

  fields.forEach((field: Field) => {
    if (field.model_name === '') {
      if (field.name !== 'id') {
        langs.push(underscore(field.name));
      }

    } else {
      if (!field.is_array) {
        langs.push(underscore(field.name) + '_id');
      }

    }
  })

  langs.forEach((lang: string) => {
    lines.push(
      `export const ${ lang }: FieldInterface = {`,
      `  title: '',`,
      `  label: '',`,
      `  placeholder: '',`,
      `};`,
      ``,
    );
  });

  return lines.join('\n');
}
