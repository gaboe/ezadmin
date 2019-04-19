import * as React from 'react';
import { debounce } from 'lodash';
import { Input } from 'semantic-ui-react';

type Props = {
  value: string;
  onChange: (name: string) => void
};

type State = {
  value: string
}

class NameInput extends React.Component<Props, State> {
  public setSearchTerm = debounce(searchTerm => {
    this.props.onChange(searchTerm);
  }, 500);

  constructor(props: Props) {
    super(props);
    this.state = { value: props.value }
  }

  public render() {
    return (
      <Input
        value={this.state.value}
        placeholder="Table title"
        onChange={e => {
          const val = e.target.value;
          this.setState({ value: val }, () => this.setSearchTerm(val))
        }}
      />
    );
  }
}

export { NameInput };
