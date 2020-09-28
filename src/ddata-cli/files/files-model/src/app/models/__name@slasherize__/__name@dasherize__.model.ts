<%= modelImports %>

export class <%= classify(name) %> extends BaseModel implements <%= classify(name) %>Interface {
  readonly api_endpoint = '/<%= slasherize(name) %>';
  readonly model_name = '<%= classify(name) %>';
<%= modelFieldList %>

  fields: FieldContainerInterface<<%= classify(name) %>UIFieldsInterface> = {
<%= modelUiFields %>
  };

  init(data?: any): <%= classify(name) %>Interface {
    data = !!data ? data : {};

<%= modelInitStatements %>

    return this;
  }

  prepareToSave(): any {
<%= modelPrepareToSaveStatements %>
  }
}
