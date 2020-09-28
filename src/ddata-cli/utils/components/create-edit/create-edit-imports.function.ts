import { classify, dasherize } from "@angular-devkit/core/src/utils/strings";
import { Field } from "../../../field";
import { slasherize } from "../../slasherize.function";

export function createEditImports(name: string, fields: Field[], arrays: string[]): string {
  const imports: string[] = [
    `import { Component, OnInit${ arrays.length > 0 ? ', OnDestroy' : '' } } from '@angular/core';`,
    `import { ${ classify(name) }Interface } from 'src/app/models/${ slasherize(name) }/${ dasherize(name) }.interface';`,
    `import { ${ classify(name) } } from 'src/app/models/${ slasherize(name) }/${ dasherize(name) }.model';`,
    `import { BaseCreateEditComponent } from 'ddata-core';`,
  ];

  if (arrays.length > 0) {
    imports.push(`import { DialogContentWithOptionsInterface } from 'ddata-ui-dialog';`);
  }

  fields.filter(item => item.is_array === true).forEach((field: Field) => {
    imports.push(
      `import { ${ field.model_name }Interface } from 'src/app/models/${ slasherize(field.model_name) }/${ dasherize(field.model_name) }.interface';`,
      `import { ${ field.model_name }CreateEditComponent } from 'src/app/components/${ slasherize(field.model_name) }/${ dasherize(field.model_name) }-create-edit/${ dasherize(field.model_name) }-create-edit.component';`,
      `import { ${ field.model_name }ListComponent } from 'src/app/components/${ slasherize(field.model_name) }/${ dasherize(field.model_name) }-list/${ dasherize(field.model_name) }-list.component';`,
      );
  })

  if (arrays.length > 0) {
    imports.push(
      `import { Subscription } from 'rxjs';`,
      `import { DataFactory } from 'src/app/factories/data.factory';`,
    );
  }

  return imports.join('\n');
}
