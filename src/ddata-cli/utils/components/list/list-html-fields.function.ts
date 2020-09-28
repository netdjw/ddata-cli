import { Field } from "../../../field";

export function listHtmlFields(fields: Field[]) {
  const lines: string[] = [];

  fields.filter(field => field.is_array === false).forEach((field) => {
    // skip 'id'
    if (field.name === 'id') {
        return;
    }

    // add comments to readable code
    lines.push(`      <!-- ${ field.name } -->`);

    if (field.type !== 'boolean') {
      // add field as string
      lines.push(
        `      <div class="col-12 col-md-4 py-md-2 data-col" [class.inactive]="model.is_inactive">`,
        `        {{ model.${ field.model_name.length === 0 ? field.name : field.name + '.name' } }}`,
        `      </div>`,
      );
    } else {
      // add booleans as a checkbox
      lines.push(
        `      <div class="col-12 col-md-1 py-2 data-col">`,
        `        <dd-input-checkbox [mode]="model" field="${ field.name }"></dd-input-checkbox>`,
        `      </div>`,
      );
    }

    lines.push(``);
  });

  return lines.join('\n');
}
