import { debounce } from "lodash";
import * as React from "react";
import { Input } from "semantic-ui-react";

type Props = { onChange: (name: string) => void };
class NameInput extends React.Component<Props> {
  public setSearchTerm = debounce(searchTerm => {
    this.props.onChange(searchTerm);
  }, 500);

  public render() {
    return (
      <Input
        placeholder="Table title"
        onChange={e => this.setSearchTerm(e.target.value)}
      />
    );
  }
}

export { NameInput };
