import { classify, dasherize, underscore } from '@angular-devkit/core/src/utils/strings';
import { Field } from '../../../field';
import { Import } from '../../../import';
import { slasherize } from '../../slasherize.function';

export function modelImports(imports: Import[], fields: Field[], custom_types: string, name: string) {
  const lines: string[] = [
    `import { BaseModel, ID${ custom_types }, FieldContainerInterface } from 'ddata-core';`,
    `import { ${ classify(name) }Interface, ${ classify(name) }UIFieldsInterface } from './${ dasherize(name) }.interface';`,
  ];
  const langs: string[] = [];

  imports.forEach((field: Import) => {
    lines.push(
      `import { ${ field.name }Interface } from '${ field.interface_src }';`,
      `import { ${ field.name } } from '${ field.model_src }';`,
    );
  });

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
  });

  lines.push(`import { ${ langs.join(', ') } } from 'src/app/i18n/${ slasherize(name) }.i18n';`);

  return lines.join('\n');
}
