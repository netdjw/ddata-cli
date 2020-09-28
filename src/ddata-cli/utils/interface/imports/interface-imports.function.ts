import { Import } from '../../../import';

export function interfaceImports(imports: Import[]) {
  const field_definitions: string[] = [];

  imports.forEach((field: Import) => {
    field_definitions.push(`import { ${ field.name }Interface } from '${ field.interface_src }';`);
  });

  return field_definitions.join('\n');
}
