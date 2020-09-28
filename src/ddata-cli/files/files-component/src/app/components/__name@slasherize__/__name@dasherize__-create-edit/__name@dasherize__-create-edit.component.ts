<%= createEditImports %>

@Component({
  selector: 'app-<%= dasherize(name) %>-create-edit',
  templateUrl: './<%= dasherize(name) %>-create-edit.component.html',
  styleUrls: ['./<%= dasherize(name) %>-create-edit.component.css']
})
export class <%= classify(name) %>CreateEditComponent extends BaseCreateEditComponent<<%= classify(name) %>Interface> implements OnInit<% if (arrays.length > 0) { %>, OnDestroy<% } %> {
<%= createEditFieldDefinition %>

  constructor() {
    super(<%= classify(name) %>);
  }

<%= createEditFunctions %>

}
