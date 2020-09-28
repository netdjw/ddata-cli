import { Field } from "../../../field";

export function createEditFunctions(fields: Field[], arrays: string[]) {
  const lines: string[] = [];

  if (arrays.length > 0) {
    const items: string[] = [];
    fields.filter(item => item.is_array === true).forEach((item) => {
      items.push(`'${item.name}'`);
    });

    lines.push(
      `  ngOnDestroy(): void {`,
      `    this.subscription.unsubscribe();`,
      `  }`,
      ``,
      `  load(): void {`,
      `    this.subscription = this.loader.load(`,
      `      [${ items.join(', ') }],`,
      `      this,`,
      `      [this.helperService.getOne(this.model, this.isModal)]`,
      `    ).subscribe();`,
      `  }`,
    );
  }

  return lines.join('\n');
}
