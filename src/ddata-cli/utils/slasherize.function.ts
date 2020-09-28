import { dasherize } from "@angular-devkit/core/src/utils/strings";

export function slasherize(name: string) {
  return dasherize(name).replace(new RegExp(/\-/g), '/');
}
