import { BaseModelWithoutTypeDefinitionInterface, ID<%= custom_types %> } from 'ddata-core';
<%= interfaceImports %>

export interface <%= classify(name) %>UIFieldsInterface {
<%= interfaceUiFieldsList %>
}

export interface <%= classify(name) %>Interface extends
  <%= classify(name) %>UIFieldsInterface,
  BaseModelWithoutTypeDefinitionInterface {

<%= interfaceOtherFieldsList %>
}
