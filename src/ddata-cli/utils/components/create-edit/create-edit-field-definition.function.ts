import { camelize, classify, underscore } from "@angular-devkit/core/src/utils/strings";
import { Field } from "../../../field";

export function createEditFieldDefinition(fields: Field[], arrays: string[]) {
  const lines: string[] = [];

  fields.forEach((field: Field) => {
    if (field.model_name !== '') {
      if (field.is_array) {
        lines.push(`  ${ underscore(field.name) }: ${ classify(field.model_name) }Interface[] = [];`);
      }
    }
  });

  if (arrays.length > 0) {
    fields.filter(item => item.is_array === true).forEach((field: Field) => {
      lines.push(
        `  ${ camelize(field.model_name) }DialogSettings: DialogContentWithOptionsInterface = {`,
        `    createEditComponent: ${ field.model_name }CreateEditComponent,`,
        `    createEditOptions: {},`,
        `    listComponent: ${ field.model_name }ListComponent,`,
        `    listOptions: {`,
        `      models: this.${ underscore(field.name) },`,
        `      isModal: true,`,
        `      multipleSelectEnabled: true,`,
        `      isSelectionList: true,`,
        `      loadData: false,`,
        `      selectedElements: this.model.${ underscore(field.name) },`,
        `    },`,
        `  };`,
      );
    });

    lines.push(
      `  subscription: Subscription;`,
      `  loader: DataFactory = new DataFactory();`,
    );
  }

  return lines.join('\n');
}
