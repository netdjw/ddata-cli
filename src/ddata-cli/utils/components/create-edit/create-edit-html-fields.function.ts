import { camelize, underscore } from "@angular-devkit/core/src/utils/strings";
import { Field } from "../../../field";
const pluralize = require('pluralize');

export function createEditHtmlFields(fields: Field[]) {
  const lines: string[] = [];

  fields.forEach((field: Field) => {
    // skip 'id'
    if (field.name === 'id') {
      return;
    }

    // set the comment line to readeble code
    lines.push(`    <!-- ${ underscore(field.name) } -->`);
    let str = '';

    if (field.model_name === '') {
      if (field.type === 'string' || field.type === 'number') {
        // string, number => input[text]
        str = `    <dd-input [model]="model" field="${ underscore(field.name) }"></dd-input>`;

      } else if (field.type === 'boolean') {
        // boolean => input[checkbox]
        str = `    <dd-input-checkbox [model]="model" field="${ underscore(field.name) }" [showLabelAfter]="false"></dd-input-checkbox>`;

      } else if (field.type === 'text') {
        // text => textarea
        str = `    <dd-textarea [model]="model" field="${ underscore(field.name) }"></dd-textarea>`;

      } else if (field.type === 'ISODate') {
        // ISODate => input[text] + date picker
        str = `    <dd-input-date [model]="model" field="${ underscore(field.name) }"></dd-input-date>`;

      } else if (field.type === 'Time') {
        // Time => input[text] + time picker
        str = `    <dd-input-time [model]="model" field="${ underscore(field.name) }"></dd-input-time>`;
      } else if (field.type === 'ColorHexaCode') {
        // ColorHexaCode => input[text] + color picker
        str = `    <dd-input-color [model]="model" field="${ underscore(field.name) }"></dd-input-color>`;

      }
    } else {
      if (!field.is_array) {
        // single select
        str = `    <dd-select [model]="model" field="${ underscore(field.name) }_id" [items]="${ camelize(pluralize(field.model_name)) }"></dd-select>`;

      } else {
        // multiple select
        str = `    <dd-select [model]="model" field="${ underscore(field.name) }" [items]="${ underscore(field.name) }" [multipleSelect]="true"\n` +
              `      [dialogSettings]="${ camelize(field.model_name) }DialogSettings"></dd-select>`;
      }
    }

    lines.push(str, '');
  });

  return lines.join('\n');
}
