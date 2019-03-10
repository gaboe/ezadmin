import * as React from 'react';
import styled from 'styled-components';
import {
    Container,
    Grid,
    GridRow,
    Pagination
    } from 'semantic-ui-react';

type Props = {
    onPageChange: (pageNo: number) => void;
    pageNo: number;
}

const Wrapper = styled.div`margin-top: 1em;`

const PagePagination: React.FunctionComponent<Props> = props => {
    return (<>
        <Container>
            <Grid textAlign="center">
                <GridRow>
                    <Wrapper>
                        <Pagination
                            activePage={props.pageNo}
                            boundaryRange={1}
                            onPageChange={(__, data) => props.onPageChange(Number(data.activePage))}
                            siblingRange={1}
                            totalPages={50}
                            firstItem={null}
                            lastItem={null}
                        />
                    </Wrapper>
                </GridRow>
            </Grid>
        </Container>
    </>)
}

export { PagePagination };