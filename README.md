# The `ddata-cli` Schematics Tool

This the command line interface for `ddata-core` and `ddata-ui-input`, `ddata-ui-dialog` and other ddata packages Schematic implementation that serves as boilerplate codes to your project based on ddata packages.

## Install

`npm install --save-dev ddata-cli`

If you did'nt installed yet, you need to install `ddata-core`, `ddata-ui-input` and `ddata-ui-dialog` packages:

`npm install --save ddata-core ddata-ui-input ddata-ui-dialog`

And don't forget add this modules to your `app.module.ts` file.

```typescript
import { DdataCoreModule } from 'ddata-core';
import { DdataUiInputModule } from 'ddata-ui-input';

@NgModule({
  // ...
  imports: [
    // ...
    DdataCoreModule,
    DdataUiInputModule,
  ],
  // ...
})
export class AppModule { }
```

Follow these packages installation instructions.


### Set up your environment

You need to extend your `tsconfig.app.json` file with this settings:

```json
{
  // ...
  "include": [
    "src/**/*.ts",
    "src/**/*.d.ts"
  ]
}
```

Extend your `tslint.json` to allow snake case naming convention:

```json
{
  "rules": {
    "variable-name": {
      "options": [
        "ban-keywords",
        "check-format",
        "allow-pascal-case",
        "allow-snake-case"
      ]
    },
  }
}
```

## How to use?

`ng add ddata-cli:all [ModelName] --fields=[field,definition,list]`

### Model name

Use the capitalize and singular naming convention on your model's name.

For example:
- `TaskType` (and not task_type nor tasktype)
- `Company` (and not Companies)

### --fields

With `fields` option you can define your model's fields with data type and default value.

The `fields` definition is a comma separated list. Each list element built from three information blocks:

- field name
- field data type
- field default value

The information blocks are separated by color characters (`:`). For example an information block looks like this:

`name:string:Little John`

*Note: you need to put your `fields` option's value into quotes if you use space characters in the value*


## Data types

### Primitive types

- string (default)
- number
- boolean


### Advanced types

- color
- isodate
- time
- text


#### Color

Converted as string, but in frontend will use color picker (with `dd-input-color` component).

#### ISODate

Converted as string, but in frontend will use date picker (with `dd-input-date` component).

#### Time

Converted as string, but in frontend will use time picker (with `dd-input-time` component).

#### Text

Converted as string, but in frontend will use textarea (with `dd-textarea` component).



### Custom data types

You can use any words as your data type. In this case you need to follow the singular naming convetion on your field name, and capitalize and singular naming convention on your data type.

In this case if you're not set default value, the default will be `null`.

For example:
- `address:Address`
- `billing_address:BillingAddress:new BillingAddress().init()`
- `billing_address_type:BillingAddressType`


### Custom data types with array

You can use any words as your array data type with `[]` postfix. In this case you need to follow the plural naming convention on your field name, and capitalize and singular naming convention on your data type.

In this case you can define default value, but it will be ignored. All array data's default will be an empty array.

For example:
- `addresses:Address[]`
- `billing_addresses:BillingAddress[]`
- `companies:Company[]`


## Some example

### Create model, interface, create-edit and list components

`ng g ddata-cli:all Company --fields="id:number,name,billing_address:Address,shipping_address:Address,employees:Employee[],products:Product[],is_inactive:boolean"`

`ng g ddata-cli:all Employee --fields="id:number,name,phone,email,is_inactive:boolean"`

`ng g ddata-cli:all Product --fields="id:number,name,sku,color:color,expiration_date:isodate,is_inactive:boolean"`


### Create model and interface only

`ng g ddata-cli:model Product --fields="id:number,name,sku,color:color,expiration_date:isodate,is_inactive:boolean"`


### Create components only

`ng g ddata-cli:components Product --fields="id:number,name,sku,color:color,expiration_date:isodate,is_inactive:boolean"`


### Create lang file only

`ng g ddata-cli:lang Product --fields="id:number,name,sku,color:color,expiration_date:isodate,is_inactive:boolean"`


Have fun!
