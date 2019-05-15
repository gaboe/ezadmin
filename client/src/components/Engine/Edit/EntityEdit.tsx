import * as R from "ramda";
import * as React from "react";
import styled from "styled-components";
import { ChangedColumn } from "../../../domain/generated/types";
import { Divider, Header, Icon } from "semantic-ui-react";
import {
	ENTITY_QUERY,
	EntityQueryComponent
} from "../../../graphql/queries/Engine/EntityQuery";
import { EntityForm } from "./EntityForm";

type Props = {
	pageID: string;
	entityID: string;
	onSubmit: (changedColumns: ChangedColumn[], callback: () => void) => void;
};

const Wrapper = styled.div`
	margin-top: 5em;
`;

const EntityEdit: React.FunctionComponent<Props> = props => {
	const { pageID, entityID, onSubmit } = props;

	const [changedColumns, setChangedColumns] = React.useState<ChangedColumn[]>(
		[]
	);

	const onChange = (columnID: string, value: string) =>
		setChangedColumns(
			R.append(
				{ columnID, value },
				changedColumns.filter(e => e.columnID !== columnID)
			)
		);

	const submit = () => {
		onSubmit(changedColumns, () => setChangedColumns([]));
	};

	return (
		<Wrapper>
			<EntityQueryComponent
				variables={{ pageID, entityID }}
				query={ENTITY_QUERY}
			>
				{entityQuery => {
					if (entityQuery.data && entityQuery.data.entity) {
						return (
							<>
								<Divider horizontal>
									<Header as="h4">
										<Icon name="edit" />
										Edit record from {entityQuery.data.entity.pageName}
									</Header>
								</Divider>
								<EntityForm
									pageID={pageID}
									entityID={entityID}
									onSubmit={submit}
									changedColumns={changedColumns}
									columns={entityQuery.data.entity.columns}
									onChange={onChange}
								/>
							</>
						);
					} else return <div>Loading ...</div>;
				}}
			</EntityQueryComponent>
		</Wrapper>
	);
};

export { EntityEdit };
