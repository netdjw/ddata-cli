import { strings } from '@angular-devkit/core';
import { classify, dasherize } from '@angular-devkit/core/src/utils/strings';
import { apply, Rule, SchematicContext, Tree, template, mergeWith, url, chain } from '@angular-devkit/schematics';
import { Field } from './field';
import { Import } from './import';
import { Schema } from './schema';
import { customTypesList } from './utils/custom-types/custom-types.function';
import { interfaceUiFieldsList } from './utils/interface/ui-fields/interface-ui-fields.function';
import { interfaceOtherFieldsList } from './utils/interface/other-fields/interface-other-fields.function';
import { interfaceImports } from './utils/interface/imports/interface-imports.function';
import { createEditHtmlFields } from './utils/components/create-edit/create-edit-html-fields.function';
import { slasherize } from './utils/slasherize.function';
import { createEditImports } from './utils/components/create-edit/create-edit-imports.function';
import { createEditFunctions } from './utils/components/create-edit/create-edit-functions.function';
import { createEditFieldDefinition } from './utils/components/create-edit/create-edit-field-definition.function';
import { listHtmlFields } from './utils/components/list/list-html-fields.function';
import { i18nConstList } from './utils/i18n/i18n-const-list.function';
import { modelImports } from './utils/model/imports/model-imports.function';
import { modelFieldList } from './utils/model/field/model-field-list.function';
import { modelInitStatements } from './utils/model/init/model-init-statements.function';
import { modelPrepareToSaveStatements } from './utils/model/prepareToSave/model-prepatetosave-statements.function';
import { modelUiFields } from './utils/model/field/model-ui-fields.function';

export function addAll(_options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const fields: Field[] = !!_options.fields ? parseFields(_options.fields) : [];
    const imports: Import[] = collectImports(fields);
    const arrays: string[] = collectArrays(fields);
    const custom_types: string = customTypesList(fields);
    // console.log(fields);
    // console.log(arrays);

    return chain([
      addModel(_options, fields, imports, custom_types),
      addLang(_options, fields),
      addComponents(_options, fields, arrays),
    ])(tree, _context);
  };
}

export function addModel(_options: Schema, _fields?: Field[], _imports?: Import[], _custom_types?: string): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    return mergeWith(addModelTree(_options, _fields, _imports, _custom_types))(tree, _context);
  };
}

function addModelTree(_options: Schema, _fields?: Field[], _imports?: Import[], _custom_types?: string) {
  const fields: Field[] = [];
  if (!!_fields) {
    fields.push(..._fields);
  } else {
    fields.push(...parseFields(_options.fields ?? ''));
  }

  const imports: Import[] = [];
  if (!!_imports) {
    imports.push(..._imports);
  } else {
    imports.push(...collectImports(fields));
  }

  const custom_types = !!_custom_types ? _custom_types : '';

  const sourceTemplates = url('./files/files-model');
  const sourceParamterizedTempleates = apply(sourceTemplates, [
    template({
      ..._options,
      ...strings,
      slasherize,
      custom_types,
      interfaceUiFieldsList: interfaceUiFieldsList(fields),
      interfaceOtherFieldsList: interfaceOtherFieldsList(fields),
      interfaceImports: interfaceImports(imports),
      modelImports: modelImports(imports, fields, custom_types, _options.name),
      modelFieldList: modelFieldList(fields),
      modelUiFields: modelUiFields(fields),
      modelInitStatements: modelInitStatements(fields),
      modelPrepareToSaveStatements: modelPrepareToSaveStatements(fields),
    })
  ]);

  return sourceParamterizedTempleates;
}

export function addLang(_options: Schema, _fields?: Field[]): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    return mergeWith(addLangTree(_options, _fields))(tree, _context);
  };
}

function addLangTree(_options: Schema, _fields?: Field[]) {
  const fields: Field[] = [];
  if (!!_fields) {
    fields.push(..._fields);
  } else {
    fields.push(...parseFields(_options.fields ?? ''));
  }

  const sourceTemplates = url('./files/files-lang');
  const sourceParamterizedTempleates = apply(sourceTemplates, [
    template({
      ..._options,
      ...strings,
      slasherize,
      i18nConstList: i18nConstList(fields),
    })
  ]);

  return sourceParamterizedTempleates;
}

export function addComponents(_options: Schema, _fields?: Field[], _arrays?: string[]): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    return mergeWith(addComponentsTree(_options, _fields, _arrays))(tree, _context);
  };
}

export function addComponentsTree(_options: Schema, _fields?: Field[], _arrays?: string[]) {
  const fields: Field[] = [];
  if (!!_fields) {
    fields.push(..._fields);
  } else {
    fields.push(...parseFields(_options.fields ?? ''));
  }

  const arrays: string[] = [];
  if (!!_arrays) {
    arrays.push(..._arrays);
  } else {
    arrays.push(...collectArrays(fields));
  }

  const sourceTemplates = url('./files/files-component');
  const sourceParamterizedTempleates = apply(sourceTemplates, [
    template({
      ..._options,
      ...strings,
      arrays,
      slasherize,
      fields,
      createEditHtmlFields: createEditHtmlFields(fields),
      createEditImports: createEditImports(_options.name, fields, arrays),
      createEditFieldDefinition: createEditFieldDefinition(fields, arrays),
      createEditFunctions: createEditFunctions(fields, arrays),
      listHtmlFields: listHtmlFields(fields),
    })
  ]);

  return sourceParamterizedTempleates;
}

function collectArrays(fields: Field[]): string[] {
  const arrays: string[] = [];

  fields.forEach((field: Field) => {
    if (field.is_array) {
      arrays.push(field.model_name);
    }
  });

  return arrays;
}

function collectImports(fields: Field[]): Import[] {
  const str: string[] = [];
  const imports: Import[] = [];

  fields.forEach((field: Field) => {
    if (field.model_name.length > 0) {
      str.push(field.model_name);
    }
  });

  const unique_models = str.filter((value, index, array) => array.indexOf(value) === index);

  unique_models.forEach((name: string) => {
    imports.push({
      name,
      model_src: getModelSrc(name),
      interface_src: getInterfaceSrc(name),
    });
  })

  return imports;
}

function parseFields(fields_list: string) {
  const params: Field[] = [];

  fields_list.split(',').forEach((field: string) => {
    const field_settings = field.split(':');
    params.push({
      name: field_settings[0],
      type: getType(field_settings[1] ? field_settings[1].replace(/\[\]$/, '') : ''),
      default: field_settings[2] ?? getFieldDefault(field_settings[1] ?? 'string'),
      model_name: getModelName(field_settings[1] ? field_settings[1].replace(/\[\]$/, '') : ''),
      is_array: /\[\]/.test(field_settings[1]),
    });
  });

  return params;
}

function getInterfaceSrc(type: string) {
  return getModelPath(type, 'interface') ?? '';
}

function getModelSrc(type: string) {
  return getModelPath(type, 'model') ?? '';
}

function getModelPath(type: string, file_type: string) {
  return 'src/app/models/' + slasherize(type) + '/' + dasherize(type) + '.' + file_type;
}

function getType(type: string) {
  if (type === 'string' || type === 'number' || type === 'boolean' || type === 'text') {
    return type;
  }

  if (type === 'isodate') {
    return 'ISODate';
  }

  if (type === 'time') {
    return 'Time';
  }

  if (type === 'color') {
    return 'ColorHexaCode';
  }

  if (type === '') {
    return 'string';
  }

  return type + 'Interface';
}

function getModelName(name: string) {
  const type = getType(name);
  if (type === 'string' || type === 'number' || type === 'boolean' || type === 'text' || type === 'ColorHexaCode' || type === 'ISODate' || type === 'Time') {
    return '';
  }

  return classify(name);
}

function getFieldDefault(type: string) {
  if (/\[\]$/.test(type)) {
    return '[]';
  }

  switch (type) {
    case 'string':
      return '\'\'';

    case 'text':
      return '\'\'';

    case 'isodate':
      return '\'\'';

    case 'time':
      return '\'\'';

    case 'color':
      return '\'\'';

    case 'number':
      return '0';

    case 'boolean':
      return 'false';

    default:
      return 'null';
  }
}

