// Option A: Directly referencing the private APIs
// import { ModuleOptions, buildRelativePath } from "@schematics/angular/utility/find-module";
// import { Rule, Tree, SchematicsException } from "@angular-devkit/schematics";
// import { dasherize, classify } from "@angular-devkit/core";
// import { addDeclarationToModule, addExportToModule } from "@schematics/angular/utility/ast-utils";
// import { InsertChange } from "@schematics/angular/utility/change";

// Option B: Using a fork of the private APIs b/c they can change

import { Rule, Tree, SchematicsException } from '@angular-devkit/schematics';
import { AddToModuleContext } from './add-to-module-context';
import * as ts from 'typescript';
import { strings } from '@angular-devkit/core';
import { slasherize } from '../slasherize.function';

const { dasherize, classify } = strings;

// Referencing forked and copied private APIs
import { ModuleOptions, buildRelativePath } from '../schematics-angular-utils/find-module';
import { addDeclarationToModule, addExportToModule } from '../schematics-angular-utils/ast-utils';
import { InsertChange } from '../schematics-angular-utils/change';

const stringUtils = { dasherize, classify };

export function addDeclarationToNgModule(options: ModuleOptions, exports: boolean): Rule {
  return (host: Tree) => {
    addDeclaration(host, options, 'create-edit');
    addDeclaration(host, options, 'list');

    if (exports) {
      addExport(host, options, 'create-edit');
      addExport(host, options, 'list');
    }

    return host;
  };
}

function createAddToModuleContext(host: Tree, options: ModuleOptions, type: 'create-edit' | 'list'): AddToModuleContext {
  const result = new AddToModuleContext();

  if (!options.module) {
    throw new SchematicsException(`Module not found.`);
  }

  const fileName = `/src/app/${options.module}.module.ts`;
  const text = host.read(fileName);

  if (text === null) {
    throw new SchematicsException(`File "${fileName}" does not exist!`);
  }

  const sourceText = text.toString('utf-8');
  result.source = ts.createSourceFile(fileName, sourceText, ts.ScriptTarget.Latest, true);

  const componentPath = `/src/app/${!!options.path ? options.path + '/' : '/'}`
    + 'components/'
    + slasherize(options.name) + '/'
    + stringUtils.dasherize(options.name) + `-${type}/`
    + stringUtils.dasherize(options.name) + `-${type}.component`;

  result.relativePath = buildRelativePath(fileName, componentPath);
  result.classifiedName = stringUtils.classify(`${options.name}-${type}Component`);

  return result;
}

function addDeclaration(host: Tree, options: ModuleOptions, type: 'create-edit' | 'list') {

  const context = createAddToModuleContext(host, options, type);
  const modulePath = !!options.module ? `/src/app/${options.module}.module.ts` : '';
  const declarationChanges = addDeclarationToModule(context.source,
    modulePath,
    context.classifiedName,
    context.relativePath);

  const declarationRecorder = host.beginUpdate(modulePath);

  for (const change of declarationChanges) {
    if (change instanceof InsertChange) {
      declarationRecorder.insertLeft(change.pos, change.toAdd);
    }
  }

  host.commitUpdate(declarationRecorder);
}

function addExport(host: Tree, options: ModuleOptions, type: 'create-edit' | 'list') {
  const context = createAddToModuleContext(host, options, type);
  const modulePath = options.module || '';
  const exportChanges = addExportToModule(context.source,
      modulePath,
      context.classifiedName,
      context.relativePath);

  const exportRecorder = host.beginUpdate(modulePath);

  for (const change of exportChanges) {
    if (change instanceof InsertChange) {
      exportRecorder.insertLeft(change.pos, change.toAdd);
    }
  }

  host.commitUpdate(exportRecorder);
}
